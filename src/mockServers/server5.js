const http = require("http");

const server = http.createServer();

server.on("request", (req, res) => {
  if (req.method == "GET") {
    if (req.url == "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      const response = JSON.stringify({ status: "OK" });
      res.end(response);
    }
    if (req.url == "/test") {
      res.writeHead(200, { "Content-Type": "application/json" });
      const response = JSON.stringify({ body: "Hello from server 5" });
      res.end(response);
    }
  }
});

server.listen(3005, () => {
  console.log("Listening on PORT 3005");
});
