const http = require("http");

const server = http.createServer();

const servers = [
  { host: "localhost", port: 3001 },
  { host: "localhost", port: 3002 },
  { host: "localhost", port: 3003 },
  { host: "localhost", port: 3004 },
  { host: "localhost", port: 3005 },
];

server.on("request", async (lbRequest, lbResponse) => {
  const server = await selectServerRoundRobin();

  const request = http.request({
    host: server.host,
    port: server.port,
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

async function selectServerRoundRobin() {
  while (true) {
    const server = servers.shift();
    try {
      const status = await getServerStatus(server);
      if (status === "healthy") {
        servers.push(server);
        return server;
      } else {
        servers.push(server);
      }
    } catch (err) {
      servers.push(server);
      continue;
    }
  }
}

function getServerStatus(server) {
  return new Promise((resolve, reject) => {
    const request = http.request({
      host: server.host,
      port: server.port,
      method: "GET",
      path: "/health",
    });

    request.on("response", (res) => {
      if (res.statusCode === 200) resolve("healthy");
      else resolve("unhealthy");
    });

    request.on("error", (err) => {
      reject("An error occured", err);
    });

    request.end();
  });
}
