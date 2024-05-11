async function selectServerRoundRobin(http, servers) {
  while (true) {
    const server = servers.shift();
    try {
      const status = await getServerStatus(http, server);
      if (status === "healthy") {
        servers.push(server);
        return { server, servers };
      } else {
        servers.push(server);
      }
    } catch (err) {
      servers.push(server);
      continue;
    }
  }
}

function getServerStatus(http, server) {
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

module.exports = { selectServerRoundRobin };
