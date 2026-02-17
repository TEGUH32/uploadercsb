// =====================================================
// UPLOAD FILE BY TEGUH - VERCEL VERSION
// NO FILE SYSTEM - PAKE MEMORY & BASE64
// =====================================================

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS request (preflight)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            error: 'Method not allowed' 
        });
    }

    try {
        // Parse multipart/form-data
        const formData = await new Promise((resolve, reject) => {
            const busboy = require('busboy')({ headers: req.headers });
            const result = { files: [] };
            
            busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
                const chunks = [];
                file.on('data', data => chunks.push(data));
                file.on('end', () => {
                    result.files.push({
                        fieldname,
                        filename,
                        mimetype,
                        encoding,
                        buffer: Buffer.concat(chunks)
                    });
                });
            });
            
            busboy.on('finish', () => resolve(result));
            busboy.on('error', reject);
            req.pipe(busboy);
        });

        if (formData.files.length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'No file uploaded' 
            });
        }

        const file = formData.files[0];
        
        // Generate random filename
        const ext = file.filename.split('.').pop();
        const randomName = Math.random().toString(36).substring(2, 15) + 
                          Math.random().toString(36).substring(2, 15) + 
                          '.' + ext;

        // Convert to base64
        const base64 = file.buffer.toString('base64');
        const dataUrl = `data:${file.mimetype};base64,${base64}`;

        // Return data (store in memory, not file system)
        const baseUrl = process.env.VERCEL_URL 
            ? `https://${process.env.VERCEL_URL}` 
            : `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}`;

        res.json({
            success: true,
            file: {
                name: file.filename,
                filename: randomName,
                size: file.buffer.length,
                type: file.mimetype,
                url: `${baseUrl}/api/file/${randomName}`,
                // For preview (limited size)
                preview: file.buffer.length < 5 * 1024 * 1024 ? dataUrl : null
            }
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
}
