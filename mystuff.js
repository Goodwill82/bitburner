// This file has convenience functions that do not cost extra RAM. To get around these constraints, when data that would 
// require RAM cost to obtain is needed, it is instead given through arguments. This allows the caller to incur the cost 
// explicitly so there is no question about where the cost came from. 
// Since there is no excess RAM overhead, can import everything with: 
// import * as ms from "/mystuff.js";

// ns_* functions tested up to version [Bitburner v2.2.1 (c46cedd5)]
export function ns_weakenAnalyze(threads = 1, cores = 1) {
	if (threads < 1 || cores < 1) {
		return NaN;
	}
	let fl_cores = Math.floor(cores);
	if (fl_cores == 1) {
		return Math.floor(threads) * 0.05
	}
	return Math.floor(threads) * (0.046875 + 0.003125 * fl_cores);
}

// as of v2.2.1, growthAnalyzeSecurity threads returns 0.004/thread no matter how many cores
// this does not take into account the max threads needed to grow to 100%.
export function ns_growthAnalyzeSecurity(threads = 1, hostname = "", cores = 1) {
	if (threads < 1 || cores < 1) {
		return NaN;
	}
	return Math.floor(threads) * 0.004;
}

// this does not take into account the max threads needed to hack all money.
export function ns_hackAnalyzeSecurity(threads = 1, hostname = "") {
	if (threads < 1) {
		return NaN;
	}
	return Math.floor(threads) * 0.002;
}

// TODO: 
//growthAnalyze(host, growthAmount, cores) -- Calculate the number of grow threads needed to grow a server by a certain multiplier.
//hackAnalyze(host) -- Get the part of money stolen with a single thread.
//hackAnalyzeChance(host) -- Get the chance of successfully hacking a server.
//hackAnalyzeThreads(host, hackAmount) -- Predict the effect of hack.

// non ns (or no cost ns) functions

export const TXcost = 100e3; // $100k
export const MaxPorts = 20; //update when "Netscript port size" in Options are changed  (does it change this?)
export const NullPortData = "NULL PORT DATA";
export const RootPrograms = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe"];
export const SpecialServers = ["darkweb", "CSEC", "run4theh111z", ".", "The-Cave", "I.I.I.I", "avmnite-02h"];
export const ServerAttrBit = { personal: 1 << 0, special: 1 << 1, profit: 1 << 2, ram: 1 << 3 };

export function serverAttr(serverObj) {
	let attrBit = 0;
	if (serverObj.purchasedByPlayer) { attrBit += ServerAttrBit.personal; }
	if (SpecialServers.includes(serverObj.hostname)) { attrBit += ServerAttrBit.special; }
	if (serverObj.moneyMax > 1) { attrBit += ServerAttrBit.profit; }
	if (serverObj.maxRam > 1e-4) { attrBit += ServerAttrBit.ram; }
	return attrBit;
}

export function getAugCostMultiplier(augsPurchased) {
	return Math.pow(1.9, Math.floor(augsPurchased));
}

export function nearEqual(num1, num2, tol = 1e-9) {
	return Math.abs(num1 - num2) <= tol;
}

export function shuffleArray(array) {
	for (let ii = array.length - 1; ii > 0; --ii) {
		const jj = Math.floor(Math.random() * (ii + 1));
		[array[ii], array[jj]] = [array[jj], array[ii]];
	}
}

export function arrayRemove(arr, val, rem = 1) {
	while (rem > 0) {
		--rem;
		let idx = arr.indexOf(val);
		if (idx > -1) {
			// only splice array when item is found
			arr.splice(idx, 1); // 2nd parameter means remove one item only
			continue;
		}
		break;
	}
}

export class DelayObject {
	constructor(writeFile, fName = "", fArgs = [], priority = false) {//, fAwait = false) {
		this.writeFile = writeFile; // if string, write to file - else, write to portObject at this address (validity assumed)
		this.fName = fName;
		this.fArgs = fArgs;
		this.priority = priority;
		//this.fAwait = fAwait;
		this.ret = null;
	}
}

export function isPrime(num) {
	// Check if num is less than 2 (not a prime number)
	if (num < 2) {
		return false;
	}
	// Check if num has a fractional part
	if (num > Math.floor(num)) {
		return false;
	}
	// Check if num is 2 (a prime number)
	if (num === 2) {
		return true;
	}
	// Check if num is even (not a prime number)
	if (num % 2 === 0) {
		return false;
	}
	// Check for factors up to the square root of num
	let chk = Math.ceil(Math.sqrt(num)) + 1;
	for (let i = 3; i < chk; i += 2) {
		if (num % i === 0) {
			return false;
		}
	}
	// If no factors are found, num is a prime number
	return true;
}
export function primesInRange(start, end) {
	let primes = [];
	function chkPrime(num) {
		if (isPrime(num)) {
			primes.push(num);
		}
	}
	for (let ii = Math.max(2, Math.floor(start)); ii < 4; ++ii) {
		chkPrime(ii);
	}
	for (let ii = Math.max(5, Math.floor(start)); ii < end; ii += 2) {
		chkPrime(ii);
	}
	return primes;
}

export function primeFactors(ns, num) {
	let ni = Math.floor(num);
	let pFactors = [1,];
	let primes = primesInRange(2, ni);
	//ns.tprint(`primesInRange: ${primes}`);
	for (let prime of primes) {
		let tryPrime = true;
		while (tryPrime) {
			let tryDiv = ni / prime;
			let tryRem = ni % prime;
			if (tryRem > 0) {
				tryPrime = false;
			}
			else {
				ni = tryDiv;
				pFactors.push(prime);
			}
		}
	}
	pFactors.push(Math.floor(num));
	return pFactors;
}

export function fMoney(money) {
	let dispMoney = Math.abs(money);
	let sign = money < 0 ? -1 : 1;
	let tenPower = 0;
	while (dispMoney >= 1e3) {
		dispMoney /= 1e3;
		tenPower += 3;
	}
	let letter = "";
	switch (tenPower) {
		case 0: break;
		case 3: letter = "k"; break;
		case 6: letter = "m"; break;
		case 9: letter = "b"; break;
		case 12: letter = "t"; break;
		case 15: letter = "q"; break; // quadrillian
		case 18: letter = "Q"; break; // quintillian
		case 21: letter = "s"; break; // sextillian
		case 24: letter = "S"; break; // septillian
		case 27: letter = "o"; break; // octillian
		case 30: letter = "n"; break; // nonillian
		case 33: letter = "d"; break; // decillian
		default: return "[!!] money (" + money + ") > 10e33 [!!]";
	}
	return `${sign < 0 ? "-" : " "}\$${dispMoney.toFixed(3)}${letter}`;
	//sprintf("$%0.3f%s", dispMoney * sign, letter);
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
		case "d": tenPower += 3; // fallthru and add it up
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
		case "0": // fallthru - ending in number is fine
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


export function fTimeUnits(ns, ms) {
	var time = ms;
	let units = [" ms", "sec", "min", "hrs", "day", "yrs"];
	let limits = [1000, 60, 60, 24, 365, 0];
	var ii = 0;
	while (ii < units.length - 1 && time >= limits[ii]) {
		time /= limits[ii]
		++ii;
	}
	return ns.sprintf("%6.3f %s", time, units[ii]);
}

export function fTime(ns, ms, show_ms = false) {
	var time = ms;
	let days = Math.floor(time / 86400000);
	time %= 86400000;
	let hours = Math.floor(time / 3600000);
	time %= 3600000;
	let mins = Math.floor(time / 60000);
	time %= 60000;
	let secs = Math.floor(time / 1000);
	time %= 1000;
	var tStr = ns.sprintf("%02d:%02d:%02d", hours, mins, secs);
	if (show_ms) {
		tStr = ns.sprintf("%s.%03d", tStr, time);
	}
	if (days > 0) {
		tStr = ns.sprintf("%d days %s", days, tStr);
	}
	return tStr;
}

export class WaitTimer {
	constructor() {
		this.start_ms = 0;
	}
	start() {
		this.start_ms = Date.now();
	}
	elapsed_ms() {
		return Date.now() - this.start_ms;
	}

	async wait_ms(ns, msWait) {
		this.start();
		//await ns.sleep();
		//var delta = msWait - this.elapsed_ms();

		let sleep_ms = Math.min(msWait * 0.8, msWait - 10)
		if (sleep_ms > 0) {
			await ns.sleep(sleep_ms);
			let delta = msWait - this.elapsed_ms();
			if (delta > 0) {
				await this.wait_ms(ns, delta);
			}
		}
	}
}

//export async function main(ns) {
//	// compare functions when run as a sort of unit test
//	// - actually, make this another file so imports don't have ns functions
//}