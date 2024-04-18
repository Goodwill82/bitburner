export const ProfitServers = ["ecorp", "clarkinc", "megacorp", "nwo", "b-and-a", "4sigma", "kuai-gong", "blade", "omnitek", "global-pharm", "zb-def", "deltaone", "zeus-med", "nova-med", "fulcrumtech", "rho-construction", "unitalife", "lexo-corp", "catalyst", "univ-energy", "powerhouse-fitness", "alpha-ent", "galactic-cyber", "zb-institute", "aerocorp", "titan-labs", "solaris", "stormtech", "applied-energetics", "taiyang-digital", "omnia", "microdyne", "icarus", "summit-uni", "vitalife", "defcomm", "helios", "the-hub", "computek", "netlink", "syscore", "snap-fitness", "infocomm", "millenium-fitness", "rothman-uni", "aevum-police", "omega-net", "silver-helix", "crush-fitness", "johnson-ortho", "phantasy", "iron-gym", "max-hardware", "zer0", "neo-net", "harakiri-sushi", "hong-fang-tea", "nectar-net", "joesguns", "sigma-cosmetics", "foodnstuff", "n00dles", "fulcrumassets",];
export const SpecialServers = ["CSEC", "I.I.I.I", "avmnite-02h", "run4theh111z", ".", "darkweb", "The-Cave", "w0r1d_d43m0n",];
export const KnownServers = [
	...ProfitServers, ...SpecialServers,
];

export const MoneySuffixList = ["", "k", "m", "b", "t", "q", "Q", "s", "S", "o", "n"];

export function fMoney(number) {
	const Neg = number < 0;
	let absNum = Math.abs(number);
	let idx = 0;
	while (absNum > 1e3 && idx < MoneySuffixList.length) {
		absNum /= 1e3;
		++idx;
	}
	if (idx < MoneySuffixList.length) {
		return `${Neg ? "-" : " "}\$${absNum.toFixed(3)}${MoneySuffixList[idx]}`;
	}
	return `${Neg ? "-" : " "}\$${absNum.toExponential(3)}`;
}

export function unfMoney(moneyStr) {
	let mStr = moneyStr.trim();
	let neg = false;
	if (mStr.startsWith("-")) {
		neg = true;
		mStr = mStr.substring(1);
	}
	if (mStr.startsWith("$")) {
		mStr = mStr.substring(1);
	}
	let letter = mStr.charAt(mStr.length - 1);
	let tenPower = 0;
	switch (letter) {
		case "n": tenPower += 3;
		case "o": tenPower += 3;
		case "S": tenPower += 3;
		case "s": tenPower += 3;
		case "Q": tenPower += 3;
		case "q": tenPower += 3;
		case "t": tenPower += 3;
		case "b": tenPower += 3;
		case "m": tenPower += 3;
		case "k": tenPower += 3;
			mStr = mStr.substring(0, mStr.length - 1); // cut out the letter
			break;
		case "0": // intended fallthru - ending in number is fine
		case "1":
		case "2":
		case "3":
		case "4":
		case "5":
		case "6":
		case "7":
		case "8":
		case "9":
		case ".":
			break; // a '.' is probably okay?
		default: return NaN; // not a valid money string
	}
	let money = Number.parseFloat(mStr);
	if (neg) {
		if (money < 0) {
			return NaN; // already had negative sign before '$', badly formed
		}
		money *= -1.0;
	}
	while (tenPower > 0) {
		tenPower -= 3;
		money *= 1e3;
	}
	return money;
}

export const PortOpener = [
	{ abbr: "SSH", filename: "BruteSSH.exe" },
	{ abbr: "FTP", filename: "FTPCrack.exe" },
	{ abbr: "SMTP", filename: "relaySMTP.exe" },
	{ abbr: "HTTP", filename: "HTTPWorm.exe" },
	{ abbr: "SQL", filename: "SQLInject.exe" },
];

/** @param {NS} ns */
export function freeRam(ns, servName) {
	return ns.getServerMaxRam(servName) - ns.getServerUsedRam(servName);
}

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

/**
 * runTerminalCommand: Runs the given string in the terminal window. Note that the terminal must be the current window. 
 *
 * @param   {string}    command     A string with the terminal command(s) to run.
 **/
export function runTerminalCommand(command) {
	let terminalInput = eval("document").getElementById("terminal-input"), terminalEventHandlerKey = Object.keys(terminalInput)[1];
	terminalInput.value = command;
	terminalInput[terminalEventHandlerKey].onChange({ target: terminalInput });
	setTimeout(function (event) {
		terminalInput.focus();
		terminalInput[terminalEventHandlerKey].onKeyDown({ key: 'Enter', preventDefault: () => 0 });
	}, 0);
};

export function setTab(tabName, collapsed = true) {
	if (collapsed) {
		if (document.querySelectorAll(`[aria-label='${tabName}']`).length > 0) {
			document.querySelectorAll(`[aria-label='${tabName}']`)[0].nextSibling.click();
		}
	}
	else {
		let icon = "";
		if (tabName == "Terminal") {
			icon = "LastPageIcon";
		}
		else if (tabName == "Script Editor") {
			icon = "CreateIcon";
		}
		else if (tabName == "Active Scripts") {
			icon = "StorageIcon";
		}
		else if (tabName == "Create Program") {
			icon = "BugReportIcon";
		}
		else if (tabName == "Staneks Gift") {
			icon = "DeveloperBoardIcon";
		}
		else if (tabName == "Stats") {
			icon = "EqualizerIcon";
		}
		else if (tabName == "Factions") {
			icon = "ContactsIcon";
		}
		else if (tabName == "Augmentation") {
			icon = "DoubleArrowIcon";
		}
		else if (tabName == "Hacknet") {
			icon = "AccountTreeIcon";
		}
		else if (tabName == "Sleeve") {
			icon = "PeopleAltIcon";
		}
		else if (tabName == "City") {
			icon = "LocationCityIcon";
		}
		else if (tabName == "Travel") {
			icon = "AirplanemodeActiveIcon";
		}
		else if (tabName == "Job") {
			icon = "WorkIcon";
		}
		else if (tabName == "Stock Market") {
			icon = "TrendingUpIcon";
		}
		else if (tabName == "Bladeburner") {
			icon = "FormatBoldIcon";
		}
		else if (tabName == "Gang") {
			icon = "SportsMmaIcon";
		}
		else if (tabName == "Milestones") {
			icon = "CheckIcon";
		}
		else if (tabName == "Documentation") {
			icon = "HelpIcon";
		}
		else if (tabName == "Achievements") {
			icon = "EmojiEventsIcon";
		}
		else if (tabName == "Options") {
			icon = "SettingsIcon";
		}

		if (icon.length > 0 && document.querySelectorAll(`[data-testid='${icon}']`).length > 0) {
			document.querySelectorAll(`[data-testid='${icon}']`)[0].nextSibling.click();
		}
	}
}
