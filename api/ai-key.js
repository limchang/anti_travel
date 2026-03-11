import admin from 'firebase-admin';
import { getAdminDb, verifyBearerToken } from './_firebaseAdmin.js';
import { encryptSecret } from './_crypto.js';

const getDocRef = (uid) => getAdminDb().doc(`users/${uid}/private/ai`);

export default async function handler(req, res) {
  try {
    let decodedToken;
    try {
      decodedToken = await verifyBearerToken(req);
    } catch (error) {
      return res.status(401).json({ error: error?.message || 'Unauthorized' });
    }

    const docRef = getDocRef(decodedToken.uid);

    if (req.method === 'GET') {
      const snap = await docRef.get();
      const data = snap.data() || {};
      return res.status(200).json({
        hasStoredKey: !!data?.groqKeyCipher?.content || !!data?.geminiKeyCipher?.content,
        hasStoredGroqKey: !!data?.groqKeyCipher?.content,
        hasStoredGeminiKey: !!data?.geminiKeyCipher?.content,
        updatedAt: data?.updatedAt?.toDate?.()?.toISOString?.() || null,
      });
    }

    if (req.method === 'POST') {
      const groqApiKey = String(req.body?.groqApiKey || req.body?.apiKey || '').trim();
      const geminiApiKey = String(req.body?.geminiApiKey || '').trim();
      if (!groqApiKey && !geminiApiKey) {
        return res.status(400).json({ error: 'groqApiKey or geminiApiKey is required' });
      }
      const nextPayload = {
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      if (groqApiKey) nextPayload.groqKeyCipher = encryptSecret(groqApiKey);
      if (geminiApiKey) nextPayload.geminiKeyCipher = encryptSecret(geminiApiKey);
      await docRef.set(nextPayload, { merge: true });
      return res.status(200).json({
        ok: true,
        hasStoredKey: true,
        hasStoredGroqKey: !!groqApiKey,
        hasStoredGeminiKey: !!geminiApiKey,
      });
    }

    if (req.method === 'DELETE') {
      const provider = String(req.query?.provider || req.body?.provider || '').trim().toLowerCase();
      const deletePayload = {
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      if (!provider || provider === 'all') {
        deletePayload.groqKeyCipher = admin.firestore.FieldValue.delete();
        deletePayload.geminiKeyCipher = admin.firestore.FieldValue.delete();
      } else if (provider === 'groq') {
        deletePayload.groqKeyCipher = admin.firestore.FieldValue.delete();
      } else if (provider === 'gemini') {
        deletePayload.geminiKeyCipher = admin.firestore.FieldValue.delete();
      } else {
        return res.status(400).json({ error: 'provider must be groq, gemini, or all' });
      }
      await docRef.set({
        ...deletePayload,
      }, { merge: true });
      return res.status(200).json({ ok: true, hasStoredKey: false });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    const message = error?.message || 'Unknown server error';
    return res.status(500).json({ error: message });
  }
}
