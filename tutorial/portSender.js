/** @param {NS} ns */
export async function main(ns) {
  const PortNum = 1;
  let message = ns.args[0] ?? "hello!"; // send the first argument string, or send "hello!" if there are no args
  let usePortObject = true; // there are two ways to send, using a port object might be beneficial if using the same port throughout a script
  if (usePortObject) {
    // https://github.com/bitburner-official/bitburner-src/blob/stable/markdown/bitburner.netscriptport.md
    let portObj = ns.getPortHandle(PortNum);
    // https://github.com/bitburner-official/bitburner-src/blob/stable/markdown/bitburner.netscriptport.write.md
    portObj.write(message);
  }
  else {
    // https://github.com/bitburner-official/bitburner-src/blob/stable/markdown/bitburner.ns.writeport.md
    ns.writePort(PortNum, message);
  }
}
