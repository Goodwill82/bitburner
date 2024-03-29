const CurrentPIDs = [];
const FirstLinePartString = "const CurrentPIDs = ["; // this should always match the line above, up to the open bracket
export function autocomplete(data, args) { return CurrentPIDs; }
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
		let printString = "";
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
						printString += `\n PID - ${proc.pid}   	"${proc.filename}" ${proc.args.join(' ')}		 ${ramUsed.toFixed(2)} GB`;
					}
				}
				fileLines[ii] += "];"; // finish off the line
				break; //found it, stop looking
			}
		}
		ns.write(ns.getScriptName(), fileLines.join('\n'), 'w');
		printString += `\n ${totalRamUsed.toFixed(2)} GB used`;
		printString += `\n ${(ns.getServerMaxRam(ns.getHostname()) - totalRamUsed).toFixed(2)} GB free`;
		ns.tprint(printString);
	}
}
