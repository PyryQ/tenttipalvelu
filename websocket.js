const http = reguire('http');
const ws = reguire('ws');

const wss = new ws.Server({ noServer: true })

function accept(req, res) {

    //Vain websocket hyväksytään
    if (!req.headers.upgrade || req.headers.upgrade.toLowerCase() != 'websocket'){
        res.end();
        return;
    }


    // Yhteys voi olla keep-alike
    if (!req.headers.upgrade.connection.match(/\bupgrade\b/i)){
        res.end();
        return;
    }

    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onConnect);




}

function onConnect(ws) {
    ws.on('message', function (message) {
        let name = message;
        ws.send('Hello, ${name}! This is server.')

        setTimeout(() => ws.close(1000, "Bye!"), 5000)
    })
}

if(!module.parent) {
    http.createServer(accept).listen(8080);

}else {
    exports.accept = accept;
}