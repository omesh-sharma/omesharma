const fs = require("fs");
const http = require("http");
const path = require("path");

const host = "127.0.0.1";
const port = Number(process.env.PORT || 5173);
const root = path.resolve(__dirname, "..");

const contentTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".pdf": "application/pdf"
};

function resolveRequest(url) {
    let clean = decodeURIComponent(url.split("?")[0]);
    while (clean.startsWith("/")) {
        clean = clean.slice(1);
    }
    return path.resolve(root, clean || "index.html");
}

const server = http.createServer((request, response) => {
    const file = resolveRequest(request.url);

    if (!file.startsWith(root)) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
    }

    fs.readFile(file, (error, data) => {
        if (error) {
            response.writeHead(404);
            response.end("Not found");
            return;
        }

        response.writeHead(200, {
            "Content-Type": contentTypes[path.extname(file).toLowerCase()] || "application/octet-stream"
        });
        response.end(data);
    });
});

server.listen(port, host, () => {
    console.log(`Portfolio preview: http://${host}:${port}/`);
});
