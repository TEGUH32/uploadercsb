// =====================================================
// LIST FILES - SIMPLE VERSION
// =====================================================

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Return empty list (no storage in serverless)
    res.json({
        success: true,
        count: 0,
        files: []
    });
}
