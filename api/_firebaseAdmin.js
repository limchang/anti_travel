import admin from 'firebase-admin';

const getPrivateKey = () => {
  const raw = process.env.FIREBASE_ADMIN_PRIVATE_KEY || '';
  return raw.replace(/\\n/g, '\n');
};

const getCredentialConfig = () => {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = getPrivateKey();
  if (!projectId || !clientEmail || !privateKey) return null;
  return { projectId, clientEmail, privateKey };
};

export const getAdminApp = () => {
  if (admin.apps.length > 0) {
    return admin.app();
  }
  const credentialConfig = getCredentialConfig();
  if (!credentialConfig) {
    throw new Error('Firebase admin credentials are not configured');
  }
  return admin.initializeApp({
    credential: admin.credential.cert(credentialConfig),
  });
};

export const getAdminAuth = () => admin.auth(getAdminApp());
export const getAdminDb = () => admin.firestore(getAdminApp());

export const verifyBearerToken = async (req) => {
  const header = String(req.headers?.authorization || '');
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    throw new Error('Missing bearer token');
  }
  return getAdminAuth().verifyIdToken(match[1]);
};
