
const CurrentPIDs = [];
const FirstLinePartString = "const CurrentPIDs = ["; // this should always match the line above, up to the open bracket
export function autocomplete(data, args) {
  return CurrentPIDs;
}

/** @param {NS} ns */
export async function main(ns) {
  let refresh = true; // if no args (or args don't contain a valid running PID), then refresh CurrentPIDs and print running processes
  const AllProcs = ns.ps();
  for (let strPID of ns.args) {
    for (let proc of AllProcs) {
      // don't include this running script and check if it matches this process PID
      if (ns.pid != proc.pid && proc.pid == strPID) {
        refresh = false;
        ns.tail(proc.pid);
      }
    }
  }
  if (refresh) {
    // first: make a list and measure string lengths - modify file string while at it
    let header = { filepid: "PID", filename: "Filename", argStr: "Args", threads: "Threads", ram: "RAM used" };
    let padLen = {
      filepid: header.filepid.length,
      filename: header.filename.length,
      argStr: header.argStr.length,
      threads: header.threads.length,
      ram: header.ram.length
    };
    let procSpec = [];
    let totalRamUsed = 0.0;
    let fileLines = ns.read(ns.getScriptName()).split('\n');
    for (let ii = 0; ii < fileLines.length; ++ii) {
      if (fileLines[ii].indexOf(FirstLinePartString) == 0) {
        fileLines[ii] = FirstLinePartString; // rewrite the line - start with the expected string
        for (let proc of AllProcs) {
          // again, don't include this running script
          if (ns.pid != proc.pid) {
            fileLines[ii] += `${proc.pid.toFixed(0)},`;
            let ramUsed = ns.getScriptRam(proc.filename) * proc.threads;
            totalRamUsed += ramUsed;
            //printString += `\n PID - ${proc.pid}   	"${proc.filename}" ${proc.args.join(' ')}		 ${ramUsed.toFixed(2)} GB`;
            let spec = {
              filepid: proc.pid.toFixed(0),
              filename: proc.filename,
              argStr: proc.args.join(' '),
              threads: proc.threads.toFixed(0),
              ram: ns.formatRam(ramUsed)
            };
            for (let [key, val] of Object.entries(padLen)) {
              if (padLen[key] < spec[key].length) {
                padLen[key] = spec[key].length; // update max length
              }
            }
            procSpec.push(JSON.parse(JSON.stringify(spec)));
          }
        }
        fileLines[ii] += "];"; // finish off the line
        break; //found it, stop looking
      }
    }
    ns.write(ns.getScriptName(), fileLines.join('\n'), 'w');

    if (procSpec.length < 1) {
      ns.tprint("No processes are currently running.");
      ns.exit();
    }

    let printString = "\n"; // write out header first
    for (let [key, val] of Object.entries(header)) {
      printString += val.padStart(padLen[key] + 2);
    }

    for (let proc of procSpec) {
      printString += "\n"; // write out header first
      for (let [key, val] of Object.entries(proc)) {
        printString += val.padStart(padLen[key] + 2);
      }
    }
    printString += `\n ${ns.formatRam(totalRamUsed)} used`;
    printString += `\n ${ns.formatRam(ns.getServerMaxRam(ns.getHostname()) - totalRamUsed)} free`;
    ns.tprint(printString);
  }
}
