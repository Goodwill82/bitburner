
//import * as ms from "/mystuff.js"; // common functions - no extra RAM overhead
//import { function } from "/file/path.js"; // get needed functions without incuring RAM overhead of other functions in file

const FlagSchema = [["argBool", false],["argNum", 0],["argStr", ""],["argStrArr", []],["help", false],];

// autocomplete(data, args) Arguments:	
// data (Object) – general data about the game you might want to autocomplete.
// data is an object with the following properties:
// {
//     servers: list of all servers in the game.
//     txts:    list of all text files on the current server.
//     scripts: list of all scripts on the current server.
//     flags:   the same flags function as passed with ns. Calling this function adds all the flags as autocomplete arguments
// }
// args (string[]) – current arguments. Minus run script.js
export function autocomplete(data, args) {
	const ShowFlagArgs = true;
	const ShowServers = true;
	const ShowScripts = false;
	const ShowTexts = false;
	let ret = [];
	if (ShowFlagArgs) {
	    	//const FlagArgs = data.flags(FlagSchema);
	    	//let flagKeys = [];
	    	//for (let [key, val] of Object.entries(FlagArgs)) {
	    	//	if (key.startsWith("--")) {
	    	//		flagKeys.push(key);
	    	//	}
	    	//}
	    	//ret.push(...flagKeys);
		data.flags(FlagSchema); // just calling "data.flags(FlagSchema)" adds the flag strings
		// alternatively, a filtered schema can be provided (for instance, if an arg check shows the flag was already 
		// used, you can make a schema without it and call data.flags() with that so it wont show up again)
	}
	if (ShowServers) {
		ret.push(...data.servers); // adds all ingame servers that are currently available to connect to
	}
	if (ShowScripts) {
		ret.push(...data.scripts); // adds all script files (.js and .script) from home (or connected server?)
	}
	if (ShowTexts) {
		ret.push(...data.txts); // adds all text files (.txt) from home (or connected server?)
	}
	return ret;
}

/**
* Simple exported function to show how to setup docstring
* @param {NS} ns
* @param {String} str The string to repeat in the array
* @param {Number} num The size of array to return
* @returns {String[]} A string array of size num - each element is str
*/
//export async function simpleFunc(ns, str, num) { // <-- use async if an await is needed in this function - in that case it returns a promise and the the return promise must be "awaited"
export function simpleFunc(ns, str, num) {
	let repeated = [];
	for (let ii = 0; ii < num; ++ii) {
		repeated.push(str);
	}
	return repeated;
}

/** @param {NS} ns */
export async function main(ns) {
	const FlagArgs = ns.flags(FlagSchema);
	let scriptName = FlagArgs._[0] ?? "templateCopy.js";
}
