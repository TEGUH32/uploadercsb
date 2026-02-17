// =====================================================
// LIST FILES API
// =====================================================

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!global.files) global.files = new Map();
    
    const files = Array.from(global.files.entries()).map(([id, file]) => ({
        id: id,
        name: file.name,
        size: file.size,
        type: file.type,
        uploaded: file.uploaded,
        url: `/api/file/${id}`
    })).reverse().slice(0, 20); // Last 20 files

    res.json({
        success: true,
        count: files.length,
        files: files
    });
}
