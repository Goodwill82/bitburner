/** @param {NS} ns */
export async function main(ns) {
  const PortNum = 1;
  const EmptyPort = "NULL PORT DATA"; // this will be the return from reading the port if the queue is empty
  let usePortObject = true; // there are two ways to use ports, using a port object might be beneficial if using the same port throughout a script
  ns.disableLog("ALL"); // We don't want to spam the tail window with port read messages in the loop
  ns.tail();
  if (usePortObject) {
    // https://github.com/bitburner-official/bitburner-src/blob/stable/markdown/bitburner.netscriptport.md
    let portObj = ns.getPortHandle(PortNum);
    while (true) {
      // https://github.com/bitburner-official/bitburner-src/blob/stable/markdown/bitburner.netscriptport.read.md
      let portData = portObj.read();
      if (portData !== EmptyPort) {
        ns.print(`Received message: "${portData}"`);
      }
      await ns.sleep(100);
    }
  }
  else {
    while (true) {
      //https://github.com/bitburner-official/bitburner-src/blob/stable/markdown/bitburner.ns.readport.md
      let portData = ns.readPort(PortNum);
      if (portData !== EmptyPort) {
        ns.print(`Received message: "${portData}"`);
      }
      await ns.sleep(100);
    }
  }
}
