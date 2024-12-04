
export const DefaultWeakenScript = "/tutorial/weaken.js";
export const DefaultGrowScript = "/tutorial/grow.js";
export const DefaultHackScript = "/tutorial/hack.js";

/** @param {NS} ns */
export function writeScripts(ns) {
  let fileString = `/** @param {NS} ns */
export async function main(ns) {
    await ns.weaken(ns.args[0]);
}`;
  ns.write(DefaultWeakenScript, fileString, 'w');

  fileString = `/** @param {NS} ns */
export async function main(ns) {
    await ns.grow(ns.args[0]);
}`;
  ns.write(DefaultGrowScript, fileString, 'w');

  fileString = `/** @param {NS} ns */
export async function main(ns) {
    await ns.hack(ns.args[0]);
}`;
  ns.write(DefaultHackScript, fileString, 'w');
}

/** @param {NS} ns */
export async function main(ns) {
  const ReserveGB = 0; // if you want to keep some of the running server's ram available, put the GB here
  const WeakenFactor = 1.02; // if left at 1.02, it means we try to keep the server under 2% higher min security
  const GrowFactor = 1.02; // if left at 1.02, it means we try to grow the server's funds to within 2% of max
  const HackFactor = 0.33; // if left at 0.33, only attempt to hack up to 33% of the server's funds (higher percentages require more grows to compensate - typically I see between 25-50% hack amounts)

  let weakenScript = DefaultWeakenScript;
  let growScript = DefaultGrowScript;
  let hackScript = DefaultHackScript; // change these to your scripts if you like yours better - these are just the basic scripts
  writeScripts(ns); // if you are using different scripts, comment this out, too, as you wont need to write these

  // to save some ram (by not using ns.getScriptRam()), I just look at the size of the scripts I'm using and hard-code it
  //let weakenGB = ns.getScriptRam(weakenScript);
  //let growGB = ns.getScriptRam(growScript);
  //let hackGB = ns.getScriptRam(hackScript);
  let weakenGB = 1.75;
  let growGB = 1.75;
  let hackGB = 1.7;

  let target = ns.getServer(ns.args[0]); // if you don't add a first argument, this script will attack the server that this script was run on
  let runningOn = ns.getServer(ns.args[1]); // if you don't add the second argument, this script will use the server that this script was run on
  while (true) {
    target = ns.getServer(target.hostname); // everytime we loop, we want to check out the targets stats - the next thing to do depends on the server's state
    runningOn = ns.getServer(runningOn.hostname);
    let freeRAM = runningOn.maxRam - runningOn.ramUsed - ReserveGB;
    let procPID = -1;
    let threadCount = 0;
    let diffDelta = target.hackDifficulty - target.minDifficulty; // check if within WeakenFactor of min difficulty
    if (diffDelta > target.minDifficulty * WeakenFactor) {
      // the server security is too high, determine how much we need to weaken it
      let diffPerThread = ns.weakenAnalyze(1, runningOn.cpuCores);
      threadCount = Math.ceil(diffDelta / diffPerThread); // this may exceed what we can run...
      threadCount = Math.max(1, Math.min(Math.floor(freeRAM / weakenGB), threadCount)); // if so, this will reduce the threadcount down if the run server can't handle it
      if (threadCount > 0) {
        procPID = ns.run(weakenScript, { temporary: true, threads: threadCount }, target.hostname);
      }
    }
    else {
      let moneyMultNeeded = target.moneyMax / target.moneyAvailable; // check if within GrowFactor of max money
      if (moneyMultNeeded > GrowFactor) {
        // the server funds are too low, determine how much we need to grow it
        threadCount = Math.ceil(ns.growthAnalyze(target.hostname, moneyMultNeeded, runningOn.cpuCores));
        threadCount = Math.max(1, Math.min(Math.floor(freeRAM / growGB), threadCount));
        procPID = ns.run(growScript, { temporary: true, threads: threadCount }, target.hostname);
      }
      else {
        // the server is ideal for hacking - determine the appropriate amount to hack
        let hackAmount = target.moneyAvailable * HackFactor;
        threadCount = Math.ceil(ns.hackAnalyzeThreads(target.hostname, hackAmount));
        threadCount = Math.max(1, Math.min(Math.floor(freeRAM / hackGB), threadCount));
        procPID = ns.run(hackScript, { temporary: true, threads: threadCount }, target.hostname);
      }
    }

    if (procPID > 0) {
      while (await ns.sleep(400) && ns.isRunning(procPID)) { } // wait until finished
    }
    else {
      // if the process failed to start, it is likely the run server ram changed between checking it and running a process - just wait a bit and try again
      await ns.sleep(2000); // 2 seconds
    }
  }
}


// autocomplete(data, args) Arguments: 
// data (Object) – general data about the game you might want to use for autocomplete.
// data is an object with the following properties:
// {
//     servers: list of all servers in the game.
//     txts:    list of all text files on the current server.
//     scripts: list of all scripts on the current server.
//     flags:   the same flags function as passed with ns. Calling this function adds all the flags as autocomplete arguments
// }
// args (string[]) – the current arguments added
export function autocomplete(data, args) {
  return data.servers; // this allows you to use tab-completion at the terminal
}
