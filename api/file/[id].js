// =====================================================
// SERVE FILE - IN MEMORY STORAGE
// =====================================================

// Simple in-memory storage (will reset on each deploy)
// Use a database for production
const fileStorage = new Map();

export default function handler(req, res) {
    const { id } = req.query;
    
    if (!fileStorage.has(id)) {
        return res.status(404).send('File not found');
    }

    const file = fileStorage.get(id);
    
    res.setHeader('Content-Type', file.type);
    res.setHeader('Content-Disposition', `inline; filename="${file.name}"`);
    res.send(file.buffer);
}
