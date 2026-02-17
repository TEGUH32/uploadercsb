// =====================================================
// STATS
// =====================================================

const fileStorage = new Map();

export default function handler(req, res) {
    const files = Array.from(fileStorage.values());
    const totalSize = files.reduce((acc, f) => acc + f.buffer.length, 0);

    function formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
    }

    res.json({
        totalFiles: files.length,
        totalSize: totalSize,
        totalSizeFormatted: formatBytes(totalSize)
    });
}
