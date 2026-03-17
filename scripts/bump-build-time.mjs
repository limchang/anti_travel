import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const rootDir = process.cwd();
const packageJsonPath = path.join(rootDir, 'package.json');
const updateLogPath = path.join(rootDir, 'src', 'update-log.json');

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'));
const writeJson = async (filePath, value) => {
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};

const bumpPatch = (version) => {
  const [major, minor, patch] = String(version || '0.0.0').split('.').map((v) => Number(v) || 0);
  return `${major}.${minor}.${patch + 1}`;
};

const formatTimestamp = (date = new Date()) => {
  const pad = (v) => String(v).padStart(2, '0');
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const oh = pad(Math.floor(Math.abs(offsetMinutes) / 60));
  const om = pad(Math.abs(offsetMinutes) % 60);
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}${sign}${oh}:${om}`;
};

const packageJson = await readJson(packageJsonPath);
const updateLog = await readJson(updateLogPath);

const previousVersion = packageJson.version;
const nextVersion = bumpPatch(previousVersion);
const timestamp = formatTimestamp(new Date());

packageJson.version = nextVersion;
updateLog.lastUpdates = [
  { version: nextVersion, timestamp, message: 'build: 자동 빌드 타임스탬프 갱신' },
  ...(Array.isArray(updateLog.lastUpdates) ? updateLog.lastUpdates : []),
].slice(0, 30);

await writeJson(packageJsonPath, packageJson);
await writeJson(updateLogPath, updateLog);

console.log(`[bump-build-time] ${previousVersion} → ${nextVersion}  (${timestamp})`);
