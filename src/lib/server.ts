import http, { Server, IncomingMessage, ServerResponse } from 'node:http';
import { generateMetrics } from "../modules/Metrics";

export const createServer: Server = http.createServer((req: IncomingMessage, res: ServerResponse): void => {
    if (req.url === '/metrics') {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(generateMetrics());
    } else if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('OK');
    } else if (req.url === '/') {
        res.writeHead(302, { 'Location': '/metrics' });
        res.end();
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});