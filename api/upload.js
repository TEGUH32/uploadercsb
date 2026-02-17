// =====================================================
// UPLOAD BY TEGUH - SIMPLE VERSION
// =====================================================

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    // Set CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Parse multipart form
        const form = new Promise((resolve, reject) => {
            const busboy = require('busboy')({ headers: req.headers });
            const result = { files: [] };
            
            busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
                const chunks = [];
                file.on('data', data => chunks.push(data));
                file.on('end', () => {
                    result.files.push({
                        filename,
                        mimetype,
                        buffer: Buffer.concat(chunks)
                    });
                });
            });
            
            busboy.on('finish', () => resolve(result));
            busboy.on('error', reject);
            req.pipe(busboy);
        });

        const { files } = await form;
        
        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const file = files[0];
        
        // Generate ID
        const id = Math.random().toString(36).substring(2, 15);
        const ext = file.filename.split('.').pop();
        const filename = `${id}.${ext}`;

        // Convert to base64
        const base64 = file.buffer.toString('base64');
        const dataUrl = `data:${file.mimetype};base64,${base64}`;

        // Get base URL
        const baseUrl = process.env.VERCEL_URL 
            ? `https://${process.env.VERCEL_URL}` 
            : `https://${req.headers.host}`;

        res.json({
            success: true,
            file: {
                name: file.filename,
                filename: filename,
                size: file.buffer.length,
                type: file.mimetype,
                url: `${baseUrl}/api/file/${filename}`,
                preview: dataUrl
            }
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: error.message });
    }
}
