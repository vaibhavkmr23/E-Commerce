const fs = require('fs');

const requestHandler = (req, res) => {
    const url = req.url;
    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write('<body><form action="/message" method="POST" ><input type ="text" name="message"><button type="submit">Submit</button></form></body>');
        res.write("</html>");
        return res.end();
    }
    if (url === '/message' && req.method === "POST") {
        const body = [];
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        });
        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            console.log(parsedBody);
            const message = parsedBody.split('=')[1];
            fs.writeFileSync('message.txt', message, err => {
                res.statusCode = 302;
                res.setHeader("Location", '/');
                return res.end();
            });
        })
    }
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My First page</title></head>');
    res.write('<body><div>Hi this is the page</div></body>');
    res.write('</html>');
    res.end();
};

// module.exports = requestHandler;

// or

// module.exports = {
//     handler: requestHandler,
//     someText: "Some hard coded text"
// };

//Or

//module.exports.handler = requestHandler;
//module.exports.someText = " Some hard coded text";

// OR

exports.handler = requestHandler;
exports.someText = " Some hard coded text";
