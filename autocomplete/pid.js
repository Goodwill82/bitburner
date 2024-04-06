export const LastPIDs = [];
export const LastUpdateTick = 0;
export const FirstLinePartString = "export const LastPIDs = ["; // this should always match first line, up to the open bracket
export const SecondLinePartString = "export const LastUpdateTick = "; // this should always match second line, up to (not including) the number

/** @param {NS} ns */
export function refreshLastPIDs(ns, clearList = false) {
	let tick = 0;
	let rewrite = false;
	let fileLines = ns.read(ns.getScriptName()).split('\n');
	for (let ii = 0; ii < fileLines.length; ++ii) {
		if (fileLines[ii].indexOf(FirstLinePartString) == 0) {
			fileLines[ii] = FirstLinePartString; // rewrite the line - start with the expected string
			if (clearList) {
				fileLines[ii] += "];"; // finish off the line
				fileLines[ii + 1] = SecondLinePartString + "0;";
			}
			else {
				tick = Date.now(); // get tick right before running ps
				for (let proc of ns.ps()) {
					// don't include this running script
					if (ns.pid != proc.pid) {
						fileLines[ii] += `${proc.pid.toFixed(0)},`;
					}
				}
				fileLines[ii] += "];"; // finish off the line
				// add a comment after the tick value that is a human-readable date and time
				const dt = new Date(tick); // gets datetime on tick ms value
				let tsStr = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')} `; // String(4).padStart(5,'0') gives '00004'.
				tsStr += `${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}:${String(dt.getSeconds()).padStart(2, '0')}`;
				fileLines[ii + 1] = `${SecondLinePartString}${tick.toFixed(0)}; // ${tsStr}`;
			}
			rewrite = true;
			break; // found it, stop looking
		}
	}
	if (rewrite) {
		ns.write(ns.getScriptName(), fileLines.join('\n'), 'w'); // re-write the file (if we found things correctly)
	}
	return rewrite;
}

/** @param {NS} ns */
export async function main(ns) {
	// if run, update the PID list
	if (!refreshLastPIDs(ns, ns.args[0] === "clear")) {
		ns.tprint('ERROR: File may have become corrupted - could not find "FirstLinePartString" search string!')
	}
}
