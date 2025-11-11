#!/usr/bin/env node
/**
 * Simple Development Server for Portfolio
 * Serves static files and provides API endpoints
 * Author: PavlenkoTM
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

// Mock API data
const projectsData = [
    {
        id: 1,
        name: 'DeFi Yield Optimizer',
        description: 'Automated yield optimization protocol on Solana',
        tech: ['Rust', 'Solana', 'DeFi'],
        stars: 245,
        forks: 67,
        watchers: 1200,
        status: 'active'
    },
    {
        id: 2,
        name: 'Solana MEV Framework',
        description: 'High-performance MEV bot framework',
        tech: ['Rust', 'TypeScript', 'MEV'],
        stars: 389,
        forks: 102,
        watchers: 2500,
        status: 'active'
    },
    {
        id: 3,
        name: 'Web3 Developer Toolkit',
        description: 'Complete CLI toolkit for Web3 development',
        tech: ['TypeScript', 'Node.js', 'CLI'],
        stars: 512,
        forks: 134,
        watchers: 3100,
        status: 'active'
    }
];

const statsData = {
    totalProjects: 50,
    linesOfCode: 100000,
    techMastered: 15,
    commits: 2500,
    contributions: 150
};

// Request handler
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Log request
    console.log(`${new Date().toISOString()} - ${req.method} ${pathname}`);

    // CORS headers for development
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // API routes
    if (pathname.startsWith('/api/')) {
        handleApiRequest(pathname, parsedUrl.query, res);
        return;
    }

    // Serve static files
    let filePath = '.' + pathname;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // 404 - File not found
                fs.readFile('./404.html', (error, content) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    if (error) {
                        res.end('<h1>404 Not Found</h1>');
                    } else {
                        res.end(content, 'utf-8');
                    }
                });
            } else {
                // 500 - Server error
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            // Success
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// API request handler
function handleApiRequest(pathname, query, res) {
    res.setHeader('Content-Type', 'application/json');

    switch (pathname) {
        case '/api/projects':
            // Get all projects or filter by query
            let filteredProjects = projectsData;
            if (query.tech) {
                filteredProjects = projectsData.filter(p =>
                    p.tech.some(t => t.toLowerCase().includes(query.tech.toLowerCase()))
                );
            }
            res.writeHead(200);
            res.end(JSON.stringify({
                success: true,
                data: filteredProjects,
                count: filteredProjects.length
            }));
            break;

        case '/api/stats':
            // Get portfolio statistics
            res.writeHead(200);
            res.end(JSON.stringify({
                success: true,
                data: statsData
            }));
            break;

        case '/api/health':
            // Health check endpoint
            res.writeHead(200);
            res.end(JSON.stringify({
                success: true,
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime()
            }));
            break;

        case '/api/contact':
            // Contact form endpoint (mock)
            if (query.name && query.email) {
                res.writeHead(200);
                res.end(JSON.stringify({
                    success: true,
                    message: 'Message received! I\'ll get back to you soon.',
                    data: {
                        name: query.name,
                        email: query.email,
                        timestamp: new Date().toISOString()
                    }
                }));
            } else {
                res.writeHead(400);
                res.end(JSON.stringify({
                    success: false,
                    error: 'Name and email are required'
                }));
            }
            break;

        default:
            // 404 for unknown API endpoints
            res.writeHead(404);
            res.end(JSON.stringify({
                success: false,
                error: 'API endpoint not found'
            }));
    }
}

// Start server
server.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('   🚀 PORTFOLIO DEVELOPMENT SERVER');
    console.log('='.repeat(60));
    console.log(`   📡 Server running at http://localhost:${PORT}/`);
    console.log(`   🌐 Open http://localhost:${PORT}/ in your browser`);
    console.log('');
    console.log('   API Endpoints:');
    console.log(`      GET /api/projects - List all projects`);
    console.log(`      GET /api/stats - Portfolio statistics`);
    console.log(`      GET /api/health - Server health check`);
    console.log(`      GET /api/contact - Contact form (mock)`);
    console.log('');
    console.log('   Press Ctrl+C to stop the server');
    console.log('='.repeat(60));
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n🛑 SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n\n🛑 Server stopped by user');
    process.exit(0);
});
