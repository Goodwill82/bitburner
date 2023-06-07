
/** @param {NS} ns */
function fullScanPart(ns, servList, scanDepth = 1e9, host = "home", prevhost = "") {
	// this returns a list of all servers within {scanDepth} of host
	if (scanDepth > 0) {
		// two pass approach - check everything 1 level away first (scan), then scan the servers on recursion
		const servers = ns.scan(host);
		for (let server of servers) {
			// ignore the previous host in the scan
			if (server != prevhost) {
				servList.push(server);
			}
		}
		for (let server of servers) {
			if (server != prevhost) {
				fullScanPart(ns, servList, scanDepth - 1, server, host);
			}
		}
	}
}

/** @param {NS} ns */
export function fullScan(ns, host = "home", scanDepth = 1e9) {
	const servList = [];
	fullScanPart(ns, servList, scanDepth, host);
	return servList;
}

/** @param {NS} ns */
export function freeRam(ns, servName) {
	return ns.getServerMaxRam(servName) - ns.getServerUsedRam(servName);
}

export const PortOpener = [
	{ abbr: "SSH", filename: "BruteSSH.exe" },
	{ abbr: "FTP", filename: "FTPCrack.exe" },
	{ abbr: "SMTP", filename: "relaySMTP.exe" },
	{ abbr: "HTTP", filename: "HTTPWorm.exe" },
	{ abbr: "SQL", filename: "SQLInject.exe" },
];

/** @param {NS} ns */
export function countPortOpeners(ns) {
	let count = 0;
	for (let opener of PortOpener) {
		if (ns.fileExists(opener.filename, "home")) {
			++count;
		}
	}
	return count;
}

/** @param {NS} ns */
export function getServerMin(ns, servName) {
	// has the basics needed for basic crack and hack checking, for 0.75GB ram cost (ns.getServer() is 2.00GB)
	return {
		hostname: servName,
		hasAdminRights: ns.hasRootAccess(servName),
		requiredHackingSkill: ns.getServerRequiredHackingLevel(servName),
		numOpenPortsRequired: ns.getServerNumPortsRequired(servName),
		//openPortCount : ns.(servName), 
		moneyMax: ns.getServerMaxMoney(servName),
		moneyAvailable: ns.getServerMoneyAvailable(servName),
		maxRam: ns.getServerMaxRam(servName),
		ramUsed: ns.getServerUsedRam(servName),
		minDifficulty: ns.getServerMinSecurityLevel(servName),
		hackDifficulty: ns.getServerSecurityLevel(servName),
	};
}

/** @param {NS} ns */
export function allOpenerFunctions(ns) {
	return [ns.brutessh, ns.ftpcrack, ns.relaysmtp, ns.httpworm, ns.sqlinject];
}

/** @param {NS} ns */
export function openerFuncByIdx(ns, index) {
	// make sure the indices match up with PortOpener above!
	if (index < 0) {
		return null;
	}
	const OpenerFuncs = allOpenerFunctions(ns);
	if (index < OpenerFuncs.length) {
		return OpenerFuncs[index]; // just return the one asked for
	}
	return null;
}

/** @param {NS} ns */
export function openerFunc(ns, which) {
	for (let idx = 0; idx < PortOpener.length; ++idx) {
		if (which == PortOpener[idx].filename || which.toUpperCase.includes(PortOpener[idx].abbr)) {
			return openerFuncByIdx(ns, idx);
		}
	}
	return null;
}

/** @param {NS} ns */
export function openServerPorts(ns, servName) {
	let portsToOpen = ns.getServerNumPortsRequired(servName);
	if (portsToOpen < 1) { return true; }
	const OpenerFuncs = allOpenerFunctions(ns);
	if (OpenerFuncs.length != PortOpener.length) {
		ns.tprint("ERROR: Mismatching 'PortOpener' and 'allOpenerFunctions(ns)'. Check 'uutil.js' and fix!");
		return false;
	}
	for (let idx = 0; idx < OpenerFuncs.length; ++idx) {
		if (ns.fileExists(PortOpener[idx].filename, "home")) {
			OpenerFuncs[idx](servName); // exists, so run it
			--portsToOpen;
			if (portsToOpen < 1) { return true; }
		}
	}
	return false;
}
