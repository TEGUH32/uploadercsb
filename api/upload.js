// =====================================================
// UPLOAD API REAL-TIME BY TEGUH
// =====================================================

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        // Test endpoint
        return res.json({ 
            status: 'online', 
            message: 'Upload API by Teguh',
            version: '1.0.0'
        });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Parse multipart form
        const form = await new Promise((resolve, reject) => {
            const busboy = require('busboy')({ headers: req.headers });
            const result = {};
            
            busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
                const chunks = [];
                file.on('data', data => chunks.push(data));
                file.on('end', () => {
                    result.file = {
                        filename,
                        mimetype,
                        buffer: Buffer.concat(chunks)
                    };
                });
            });
            
            busboy.on('finish', () => resolve(result));
            busboy.on('error', reject);
            req.pipe(busboy);
        });

        if (!form.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const file = form.file;
        
        // Generate unique ID
        const id = Date.now().toString(36) + Math.random().toString(36).substring(2);
        const ext = file.filename.split('.').pop();
        const filename = `${id}.${ext}`;
        
        // Convert to base64
        const base64 = file.buffer.toString('base64');
        const dataUrl = `data:${file.mimetype};base64,${base64}`;

        // Get base URL
        const baseUrl = process.env.VERCEL_URL 
            ? `https://${process.env.VERCEL_URL}` 
            : `https://${req.headers.host}`;

        // Store in memory (temporary)
        // For production, use database or cloud storage
        if (!global.files) global.files = new Map();
        global.files.set(filename, {
            name: file.filename,
            buffer: file.buffer,
            type: file.mimetype,
            size: file.buffer.length,
            uploaded: new Date().toISOString()
        });

        res.json({
            success: true,
            file: {
                id: id,
                name: file.filename,
                filename: filename,
                size: file.buffer.length,
                type: file.mimetype,
                url: `${baseUrl}/api/file/${filename}`,
                preview: dataUrl,
                direct: `${baseUrl}/api/file/${filename}`
            }
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: error.message });
    }
}
