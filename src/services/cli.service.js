async function getServerDetails(rl) {
  const servers = [];
  let serverCount = 0;

  serverCount = await rl.question("Enter the number of servers");

  if (serverCount == 0 || serverCount < 0) {
    await rl.write("Please enter a valid number greater than zero!\n");
    while (serverCount == 0 || serverCount < 0) {
      serverCount = await rl.question("Enter the number of servers");
    }
  }

  console.log(`Enter the datils for the ${serverCount} servers`);

  for (let i = 1; i <= serverCount; i++) {
    const host = await rl.question(`Enter the host for the ${i}th server`);
    const port = parseInt(
      await rl.question(`Enter the port for the ${i}th server`)
    );

    servers.push({ host, port });
  }

  return servers;
}

module.exports = getServerDetails;
