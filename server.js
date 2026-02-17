// =====================================================
// UPLOAD FILE BY TEGUH
// Developer Edition - Simple & Clean
// =====================================================

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs-extra');
const mime = require('mime-types');
const axios = require('axios');

const app = express();
const PORT = 3000;
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const MAX_SIZE = 100 * 1024 * 1024; // 100MB

// Buat folder upload
fs.ensureDirSync(UPLOAD_DIR);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/files', express.static(UPLOAD_DIR));

// =====================================================
// CONFIG UPLOAD
// =====================================================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const randomName = crypto.randomBytes(6).toString('hex');
        cb(null, randomName + ext);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: MAX_SIZE }
});

// =====================================================
// API ENDPOINTS
// =====================================================

// Home page - Simple developer style
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Upload File by Teguh</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                background: #0a0a0a;
                color: #00ff00;
                font-family: 'Courier New', monospace;
                padding: 20px;
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
            .container {
                max-width: 800px;
                width: 100%;
                background: #111;
                border: 2px solid #00ff00;
                padding: 30px;
                box-shadow: 0 0 20px rgba(0,255,0,0.2);
            }
            
            h1 {
                font-size: 28px;
                margin-bottom: 10px;
                color: #00ff00;
                border-bottom: 1px solid #333;
                padding-bottom: 10px;
            }
            
            .subtitle {
                color: #666;
                margin-bottom: 30px;
                font-size: 14px;
            }
            
            .terminal {
                background: #000;
                border: 1px solid #333;
                padding: 20px;
                margin: 20px 0;
                font-family: 'Courier New', monospace;
            }
            
            .terminal-line {
                color: #00ff00;
                margin: 5px 0;
                font-size: 14px;
            }
            
            .terminal-line::before {
                content: '$ ';
                color: #666;
            }
            
            .upload-box {
                background: #000;
                border: 2px dashed #333;
                padding: 40px;
                text-align: center;
                margin: 20px 0;
                cursor: pointer;
                transition: border-color 0.3s;
            }
            
            .upload-box:hover {
                border-color: #00ff00;
            }
            
            .upload-box input {
                display: none;
            }
            
            .upload-box label {
                cursor: pointer;
                color: #00ff00;
                font-size: 16px;
            }
            
            .upload-box .icon {
                font-size: 48px;
                margin-bottom: 10px;
                color: #00ff00;
            }
            
            .progress {
                width: 100%;
                height: 20px;
                background: #222;
                margin: 10px 0;
                display: none;
            }
            
            .progress-bar {
                height: 100%;
                background: #00ff00;
                width: 0%;
                transition: width 0.3s;
            }
            
            .result {
                background: #000;
                border: 1px solid #00ff00;
                padding: 15px;
                margin: 20px 0;
                display: none;
                word-break: break-all;
            }
            
            .result a {
                color: #00ff00;
                text-decoration: none;
            }
            
            .result a:hover {
                text-decoration: underline;
            }
            
            .files-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 15px;
                margin: 20px 0;
            }
            
            .file-item {
                background: #000;
                border: 1px solid #333;
                padding: 15px;
                transition: border-color 0.3s;
            }
            
            .file-item:hover {
                border-color: #00ff00;
            }
            
            .file-name {
                font-size: 12px;
                word-break: break-all;
                margin-bottom: 10px;
                color: #00ff00;
            }
            
            .file-size {
                color: #666;
                font-size: 11px;
                margin-bottom: 10px;
            }
            
            .file-actions {
                display: flex;
                gap: 10px;
            }
            
            .file-actions a,
            .file-actions button {
                color: #00ff00;
                text-decoration: none;
                font-size: 11px;
                background: none;
                border: 1px solid #333;
                padding: 3px 8px;
                cursor: pointer;
                font-family: 'Courier New', monospace;
            }
            
            .file-actions button:hover {
                border-color: #00ff00;
            }
            
            .footer {
                margin-top: 30px;
                text-align: center;
                color: #666;
                font-size: 12px;
                border-top: 1px solid #333;
                padding-top: 20px;
            }
            
            .footer a {
                color: #00ff00;
                text-decoration: none;
            }
            
            .stats {
                display: flex;
                gap: 20px;
                margin: 20px 0;
                color: #666;
                font-size: 13px;
            }
            
            .stats span {
                color: #00ff00;
                font-weight: bold;
            }
            
            .developer-badge {
                position: fixed;
                bottom: 10px;
                right: 10px;
                color: #00ff00;
                font-size: 11px;
                opacity: 0.5;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>📁 UPLOAD FILE BY TEGUH</h1>
            <div class="subtitle">Developer Edition • Simple File Hosting</div>
            
            <div class="terminal">
                <div class="terminal-line">System ready</div>
                <div class="terminal-line">Max file size: 100MB</div>
                <div class="terminal-line">Supported: all files</div>
                <div class="terminal-line">API endpoint: /upload</div>
            </div>
            
            <div class="upload-box" onclick="document.getElementById('fileInput').click()">
                <div class="icon">📤</div>
                <input type="file" id="fileInput" onchange="uploadFile()">
                <label>Click to upload or drag & drop</label>
            </div>
            
            <div class="progress" id="progress">
                <div class="progress-bar" id="progressBar"></div>
            </div>
            
            <div class="result" id="result"></div>
            
            <div class="stats" id="stats">
                Loading stats...
            </div>
            
            <h3 style="color:#00ff00; margin:20px 0;">📋 Recent Uploads</h3>
            <div class="files-grid" id="files"></div>
            
            <div class="footer">
                <p>Upload File by Teguh • Developer Edition</p>
                <p><a href="#">GitHub</a> • <a href="#">API Docs</a> • <a href="#">Contact</a></p>
                <p style="margin-top:10px;">© 2026 Teguh Developer</p>
            </div>
        </div>
        
        <div class="developer-badge">
            dev: teguh
        </div>
        
        <script>
            async function uploadFile() {
                const file = document.getElementById('fileInput').files[0];
                if (!file) return;
                
                const formData = new FormData();
                formData.append('file', file);
                
                const progress = document.getElementById('progress');
                const progressBar = document.getElementById('progressBar');
                const result = document.getElementById('result');
                
                progress.style.display = 'block';
                result.style.display = 'none';
                
                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/upload', true);
                
                xhr.upload.onprogress = (e) => {
                    if (e.lengthComputable) {
                        const percent = (e.loaded / e.total) * 100;
                        progressBar.style.width = percent + '%';
                    }
                };
                
                xhr.onload = () => {
                    progress.style.display = 'none';
                    progressBar.style.width = '0%';
                    
                    const data = JSON.parse(xhr.responseText);
                    if (data.success) {
                        result.style.display = 'block';
                        result.innerHTML = \`
                            ✅ File uploaded!<br>
                            <a href="\${data.file.url}" target="_blank">\${data.file.url}</a><br>
                            <span style="color:#666; font-size:12px;">\${(data.file.size/1024).toFixed(2)} KB</span>
                        \`;
                    }
                    
                    loadFiles();
                    loadStats();
                };
                
                xhr.send(formData);
            }
            
            async function loadFiles() {
                const res = await fetch('/list');
                const data = await res.json();
                
                const filesEl = document.getElementById('files');
                filesEl.innerHTML = data.files.slice(0, 8).map(file => \`
                    <div class="file-item">
                        <div class="file-name">\${file.filename}</div>
                        <div class="file-size">\${(file.size/1024).toFixed(2)} KB</div>
                        <div class="file-actions">
                            <a href="\${file.url}" target="_blank">view</a>
                            <button onclick="copyUrl('\${file.url}')">copy</button>
                            <button onclick="deleteFile('\${file.filename}')">del</button>
                        </div>
                    </div>
                \`).join('');
            }
            
            async function loadStats() {
                const res = await fetch('/stats');
                const data = await res.json();
                
                document.getElementById('stats').innerHTML = \`
                    <div><span>📁 \${data.totalFiles}</span> files</div>
                    <div><span>📦 \${data.totalSizeFormatted}</span> total</div>
                    <div><span>⚡ \${data.freeSpace}</span> free</div>
                \`;
            }
            
            function copyUrl(url) {
                navigator.clipboard.writeText(url);
                alert('URL copied!');
            }
            
            async function deleteFile(filename) {
                if (confirm('Delete this file?')) {
                    await fetch('/delete/' + filename, { method: 'DELETE' });
                    loadFiles();
                    loadStats();
                }
            }
            
            // Auto refresh
            loadFiles();
            loadStats();
            setInterval(loadStats, 5000);
        </script>
    </body>
    </html>
    `);
});

// =====================================================
// API: Upload file
// =====================================================
app.post('/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                error: 'No file uploaded' 
            });
        }

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const fileUrl = `${baseUrl}/files/${req.file.filename}`;

        res.json({
            success: true,
            file: {
                filename: req.file.filename,
                original: req.file.originalname,
                size: req.file.size,
                type: req.file.mimetype,
                url: fileUrl
            }
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// =====================================================
// API: Upload multiple files
// =====================================================
app.post('/upload/multi', upload.array('files', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'No files uploaded' 
            });
        }

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const files = req.files.map(file => ({
            filename: file.filename,
            original: file.originalname,
            size: file.size,
            url: `${baseUrl}/files/${file.filename}`
        }));

        res.json({
            success: true,
            count: files.length,
            files: files
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// =====================================================
// API: Upload from URL
// =====================================================
app.post('/upload/url', async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ 
                success: false, 
                error: 'URL required' 
            });
        }

        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'arraybuffer'
        });

        const ext = path.extname(new URL(url).pathname) || '.bin';
        const filename = crypto.randomBytes(6).toString('hex') + ext;
        const filepath = path.join(UPLOAD_DIR, filename);

        fs.writeFileSync(filepath, response.data);

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const fileUrl = `${baseUrl}/files/${filename}`;

        res.json({
            success: true,
            file: {
                filename: filename,
                size: response.data.length,
                url: fileUrl
            }
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// =====================================================
// API: List files
// =====================================================
app.get('/list', (req, res) => {
    try {
        const files = fs.readdirSync(UPLOAD_DIR);
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        
        const fileList = files.map(file => {
            const stat = fs.statSync(path.join(UPLOAD_DIR, file));
            return {
                filename: file,
                size: stat.size,
                url: `${baseUrl}/files/${file}`,
                uploaded: stat.birthtime
            };
        }).sort((a, b) => b.uploaded - a.uploaded);

        res.json({
            count: fileList.length,
            files: fileList
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// =====================================================
// API: File info
// =====================================================
app.get('/info/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filepath = path.join(UPLOAD_DIR, filename);

        if (!fs.existsSync(filepath)) {
            return res.status(404).json({ 
                success: false, 
                error: 'File not found' 
            });
        }

        const stat = fs.statSync(filepath);
        const mimeType = mime.lookup(filename) || 'application/octet-stream';

        res.json({
            success: true,
            file: {
                filename: filename,
                size: stat.size,
                type: mimeType,
                uploaded: stat.birthtime,
                url: `${req.protocol}://${req.get('host')}/files/${filename}`
            }
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// =====================================================
// API: Delete file
// =====================================================
app.delete('/delete/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filepath = path.join(UPLOAD_DIR, filename);

        if (!fs.existsSync(filepath)) {
            return res.status(404).json({ 
                success: false, 
                error: 'File not found' 
            });
        }

        fs.unlinkSync(filepath);
        res.json({ 
            success: true, 
            message: 'File deleted' 
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// =====================================================
// API: Stats
// =====================================================
app.get('/stats', (req, res) => {
    try {
        const files = fs.readdirSync(UPLOAD_DIR);
        
        const totalSize = files.reduce((acc, file) => {
            try {
                return acc + fs.statSync(path.join(UPLOAD_DIR, file)).size;
            } catch {
                return acc;
            }
        }, 0);

        function formatBytes(bytes) {
            if (bytes === 0) return '0 B';
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(1024));
            return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
        }

        res.json({
            success: true,
            totalFiles: files.length,
            totalSize: totalSize,
            totalSizeFormatted: formatBytes(totalSize),
            freeSpace: formatBytes(MAX_SIZE - totalSize)
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// =====================================================
// START SERVER
// =====================================================
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔════════════════════════════════════════╗
║  📁 UPLOAD FILE BY TEGUH                ║
╠════════════════════════════════════════╣
║  Version: 1.0.0                         ║
║  Developer: Teguh                       ║
║  Port: ${PORT}                                  
║  URL: http://localhost:${PORT}                  
║  Upload: http://localhost:${PORT}/upload       
║  Files: http://localhost:${PORT}/files        
║  Max size: 100MB                          
╚════════════════════════════════════════╝
    `);
});
