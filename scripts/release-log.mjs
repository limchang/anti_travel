import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import admin from 'firebase-admin';

const rootDir = process.cwd();
const packageJsonPath = path.join(rootDir, 'package.json');
const updateLogPath = path.join(rootDir, 'src', 'update-log.json');

const [, , releaseMessageArg = '', bumpTypeArg = 'patch', ...restArgs] = process.argv;
const releaseMessage = String(releaseMessageArg || '').trim();
const bumpType = ['major', 'minor', 'patch'].includes(bumpTypeArg) ? bumpTypeArg : 'patch';
const shouldNotify = restArgs.includes('--notify');

if (!releaseMessage) {
  console.error('Usage: npm run release:log -- "<message>" [patch|minor|major] [--notify]');
  process.exit(1);
}

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'));
const writeJson = async (filePath, value) => {
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};

const bumpVersion = (version, type) => {
  const [major, minor, patch] = String(version || '0.0.0').split('.').map((value) => Number(value) || 0);
  if (type === 'major') return `${major + 1}.0.0`;
  if (type === 'minor') return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
};

const formatTimestampWithOffset = (date = new Date()) => {
  const pad = (value) => String(value).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const offsetHours = pad(Math.floor(Math.abs(offsetMinutes) / 60));
  const offsetRemainMinutes = pad(Math.abs(offsetMinutes) % 60);
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${offsetHours}:${offsetRemainMinutes}`;
};

const getCredentialConfig = () => {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || '';
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL || '';
  const privateKey = String(process.env.FIREBASE_ADMIN_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  const hasPlaceholder = [clientEmail, privateKey].some((value) => /여기에_|YOUR_PRIVATE_KEY|firebase-adminsdk-xxxxx/i.test(value));
  if (!projectId || !clientEmail || !privateKey || hasPlaceholder) return null;
  return { projectId, clientEmail, privateKey };
};

const getAdminApp = () => {
  if (admin.apps.length) return admin.app();
  const credentialConfig = getCredentialConfig();
  if (!credentialConfig) return null;
  return admin.initializeApp({
    credential: admin.credential.cert(credentialConfig),
  });
};

const collectPushTargets = async (db) => {
  const targets = new Map();

  const tokenDocs = await db.collectionGroup('pushTokens').get();
  tokenDocs.forEach((docSnap) => {
    const token = String(docSnap.data()?.token || '').trim();
    if (!token) return;
    targets.set(token, { token, refs: [docSnap.ref] });
  });

  const legacyDocs = await db.collectionGroup('private').where(admin.firestore.FieldPath.documentId(), '==', 'push').get();
  legacyDocs.forEach((docSnap) => {
    const token = String(docSnap.data()?.token || '').trim();
    if (!token) return;
    const existing = targets.get(token);
    if (existing) {
      existing.refs.push(docSnap.ref);
      return;
    }
    targets.set(token, { token, refs: [docSnap.ref] });
  });

  return [...targets.values()];
};

const sendReleasePush = async ({ version, message }) => {
  const app = getAdminApp();
  if (!app) {
    console.warn('Release push skipped: Firebase admin credentials are not configured.');
    return { sent: 0, skipped: true };
  }

  const db = admin.firestore(app);
  const targets = await collectPushTargets(db);
  const uniqueTokens = targets.map((target) => target.token);
  if (!uniqueTokens.length) {
    console.warn('Release push skipped: no saved FCM tokens were found.');
    return { sent: 0, skipped: true };
  }

  const response = await admin.messaging(app).sendEachForMulticast({
    tokens: uniqueTokens,
    notification: {
      title: `Anti Planer ${version} 업데이트`,
      body: message,
    },
    webpush: {
      notification: {
        title: `Anti Planer ${version} 업데이트`,
        body: message,
        icon: '/vite.svg',
        badge: '/vite.svg',
      },
      fcmOptions: {
        link: 'https://limchang.github.io/anti_travel/',
      },
    },
    data: {
      version,
      message,
      type: 'release',
    },
  });

  const invalidTokens = [];
  response.responses.forEach((item, index) => {
    if (item.success) return;
    const token = uniqueTokens[index];
    const code = String(item.error?.code || '');
    if (code.includes('registration-token-not-registered') || code.includes('invalid-registration-token')) {
      invalidTokens.push(token);
    }
  });

  if (invalidTokens.length) {
    const batch = db.batch();
    targets.forEach((target) => {
      if (!invalidTokens.includes(target.token)) return;
      target.refs.forEach((ref) => {
        batch.delete(ref);
      });
    });
    await batch.commit();
  }

  return { sent: response.successCount, failed: response.failureCount, skipped: false };
};

const packageJson = await readJson(packageJsonPath);
const updateLog = await readJson(updateLogPath);
const previousVersion = packageJson.version;
const nextVersion = bumpVersion(packageJson.version, bumpType);
const timestamp = formatTimestampWithOffset(new Date());

packageJson.version = nextVersion;
updateLog.lastUpdates = [
  {
    version: nextVersion,
    timestamp,
    message: releaseMessage,
  },
  ...(Array.isArray(updateLog.lastUpdates) ? updateLog.lastUpdates : []),
].slice(0, 30);

await writeJson(packageJsonPath, packageJson);
await writeJson(updateLogPath, updateLog);

console.log(`Updated version: ${previousVersion} -> ${nextVersion}`);
console.log(`Logged release at: ${timestamp}`);

if (shouldNotify) {
  const result = await sendReleasePush({ version: nextVersion, message: releaseMessage });
  if (result.skipped) {
    process.exit(0);
  }
  console.log(`Release push result: sent=${result.sent} failed=${result.failed}`);
}
