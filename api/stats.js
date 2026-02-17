// =====================================================
// STATS API
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
    
    const files = Array.from(global.files.values());
    const totalSize = files.reduce((acc, f) => acc + f.size, 0);
    const totalFiles = files.length;

    res.json({
        success: true,
        totalFiles: totalFiles,
        totalSize: totalSize,
        totalSizeFormatted: formatBytes(totalSize),
        memory: process.memoryUsage(),
        uptime: process.uptime()
    });
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}
