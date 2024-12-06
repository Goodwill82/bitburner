
export function autocomplete(data, args) {
  return [...data.scripts, ...data.txts];
}

/** @param {NS} ns */
export function fileToRedditBlock(ns, filename) {
  let filetext = ns.read(filename);
  if (filetext.length > 0) {
    for (let line of filetext.split('\n')) {
      ns.print(`    ${line}`); // add four spaces
    }
  }
  else {
    ns.print(`ERROR: Could not read file "${filename}", or it is empty.`);
  }
}

/** @param {NS} ns */
export async function main(ns) {
  //ns.disableLog("ALL");
  //ns.clearLog();
  fileToRedditBlock(ns, ns.args[0]);
  ns.tail();
}
