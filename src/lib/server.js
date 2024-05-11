const { selectServerRoundRobin } = require("../services/lbserver.service");

function setupServer(http, availableServers) {
  const server = http.createServer();

  server.on("request", async (lbRequest, lbResponse) => {
    const res = await selectServerRoundRobin(http, availableServers);
    currentServer = res.server;
    availableServers = res.servers;
    const request = http.request({
      host: currentServer.host,
      port: currentServer.port,
      method: lbRequest.method,
      path: lbRequest.url,
      headers: lbRequest.headers,
    });

    request.on("response", (res) => {
      lbResponse.writeHead(res.statusCode, res.headers);
      res.pipe(lbResponse);
    });

    request.on("error", (err) => {
      console.log(err);
      lbResponse.statusCode = 404;
      lbResponse.end("An error occured");
    });

    lbRequest.pipe(request);
  });

  server.listen(3000, () => {
    console.log("Listening on PORT 3000");
  });
}

module.exports = setupServer;
