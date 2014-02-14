var http    = require('http');
var fs      = require('fs');
var port    = (process.argv[2] || 3000);


http.createServer(function (req, res) {
    var path, file;

    path  = req.url.substring(1) || 'index.html';

    if (fs.existsSync(path)) {
        file = fs.readFileSync(path);

        res.writeHead(200);
        res.end(file);
    } else {
        res.writeHead(404);
        res.end();
    }

}).listen(port);

console.log('Listening on http://localhost:' + port);