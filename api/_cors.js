const ALLOWED_ORIGINS = [
    'https://limchang.github.io',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://localhost:3001',
    'https://anti-planer.vercel.app',
];

export const setCors = (req, res) => {
    const origin = req.headers.origin;
    const isAllowed = ALLOWED_ORIGINS.includes(origin) ||
        (origin && origin.startsWith('https://anti-planer') && origin.endsWith('.vercel.app'));

    if (isAllowed) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
        res.setHeader('Access-Control-Allow-Origin', 'https://limchang.github.io');
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '3600');
};

export const handleOptions = (req, res) => {
    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return true;
    }
    return false;
};
