// =====================================================
// GET FILE - SIMPLE VERSION
// =====================================================

// Simple in-memory storage (temporary)
const files = new Map();

export default function handler(req, res) {
    const { id } = req.query;
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (!files.has(id)) {
        return res.status(404).send('File not found');
    }

    const file = files.get(id);
    
    res.setHeader('Content-Type', file.type);
    res.setHeader('Content-Disposition', `inline; filename="${file.name}"`);
    res.send(file.buffer);
}
