// =====================================================
// GET FILE API
// =====================================================

export default function handler(req, res) {
    const { id } = req.query;
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get from global storage
    if (!global.files) global.files = new Map();
    
    const file = global.files.get(id);
    
    if (!file) {
        return res.status(404).json({ error: 'File not found' });
    }

    res.setHeader('Content-Type', file.type);
    res.setHeader('Content-Disposition', `inline; filename="${file.name}"`);
    res.setHeader('Content-Length', file.buffer.length);
    res.send(file.buffer);
}
