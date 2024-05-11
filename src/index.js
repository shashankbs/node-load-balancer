const http = require("http");
const readline = require("readline/promises");
const getServerDetails = require("./services/cli.service");
const setupServer = require("./lib/server");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let servers = [];
(async () => {
  servers = await getServerDetails(rl);
  setupServer(http, servers);
})();
