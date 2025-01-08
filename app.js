const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const fsPromises = require('node:fs').promises

const logEvents = require('./logEvents');
const EventEmitter = require('events');
class MyEmitter extends EventEmitter { };
const myEmitter = new MyEmitter();
myEmitter.on('log', (msg, fileName) => logEvents(msg, fileName));
const PORT = process.env.PORT || 3000;

const serveFile = async (filePath, contentType, res) => {
    try {
        const rawData = await fsPromises.readFile(
            filePath,
            !contentType.includes('image') ? 'utf8' : ''
        );
        const data = contentType === 'application/json'
            ? JSON.parse(rawData) : rawData;
        res.writeHead(
            filePath.includes('404.html') ?404 : 200,
            { 'Content-Type': contentType }
        );
        res.end(
            contentType === 'application/json' ? JSON.stringify(data) : data
        );
    }
    catch (err) {
        console.log(err);
        myEmitter.emit('log', `${err.name}: ${err.method}`, 'errLog.txt');
        res.statusCode = 500;
        res.end();
    }
}

const server = http.createServer((req, res) => {
    console.log(req.url, req.method);
    myEmitter.emit('log', `${req.url}\t${req.method}`, 'req.Log.txt');

    const extension = path.extname(req.url);

    let contentType;

    switch (extension) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';
    }

    let filePath;

    if (contentType === 'text/html' && req.url === '/') {
        filePath = path.join(__dirname, 'html', 'index.html');
    } else if (contentType === 'text/html' && req.url.slice(-1) === '/') {
        filePath = path.join(__dirname, 'html', req.url, 'index.html');
    } else if (contentType === 'text/html') {
        filePath = path.join(__dirname, 'html', req.url);
    } else {
        filePath = path.join(__dirname, req.url);
    }


    // makes .html extention not required in the browser
    if (!extension && req.url.slice(-1) !== '/') filePath += '.html';

    const fileExists = fs.existsSync(filePath);

    if (fileExists) {
        serveFile(filePath, contentType, res);
    } else {
        switch (path.parse(filePath).base) {
            case 'old-page.html':
                res.writeHead(301, { 'Location': '/index.html' });
                res.end();
                break;
            case 'www-page.html':
                res.writeHead(301, { 'Location': '/' });
                res.end();
                break;
            default:
                serveFile(path.join(__dirname, 'html', '404.html'), 'text/html', res);
        }
    }
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});