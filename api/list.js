// =====================================================
// LIST FILES (from memory)
// =====================================================

const fileStorage = new Map();

export default function handler(req, res) {
    const files = Array.from(fileStorage.entries()).map(([id, file]) => ({
        id,
        name: file.name,
        size: file.buffer.length,
        type: file.type,
        uploaded: file.uploaded,
        url: `/api/file/${id}`
    }));

    res.json({
        count: files.length,
        files: files.slice(0, 20) // last 20 files
    });
}
