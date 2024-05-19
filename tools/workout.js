//import * as ms from "/mystuff.js"; // common functions - no extra RAM overhead
//import { func } from "/file/path.js"; // get needed functions without incuring RAM overhead of other functions in file

export const ValidWhos = ["player", "sleeve0", "sleeve1", "sleeve2", "sleeve3", "sleeve4", "sleeve5", "sleeve6", "sleeve7"];
export const ValidWhats = ["all", "Strength", "Defense", "Dexterity", "Agility"];
export const ValidWheres = ['best', 'incity', '"Powerhouse Gym"', '"Iron Gym"', '"Crush Fitness Gym"', '"Snap Fitness Gym"', '"Millenium Fitness Gym"'];

//const FlagSchema = [["argBool", false],["argNum", 0],["argStr", ""],["argStrArr", []],["help", false],];
const FlagSchema = [["who", ValidWhos[0]],["what", ValidWhats[0]],["lvl", 100],["where", ValidWheres[0]],["help", false],];

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
	const FlagCounts = [];
	let lastFlag = null;
	for (let arg of args) {
		if (arg.startsWith("--")) {
			lastFlag = arg;
			let notInFlagCounts = true;
			for (let ii = 0; idx < FlagCounts.length; ++ii) {
				if (FlagCounts[0].flag === arg) {
					FlagCounts[0].count += 1;
					notInFlagCounts = false;
					break;
				}
			}
			if (notInFlagCounts) {
				FlagCounts.push({ flag: arg, count: 1 });
			}
		}
	}
	
	const NewFlags = [];
	const NewFlagSchema = [];
	//const FlagArgs = data.flags(FlagSchema);
	//let flagKeys = [];
	for (let [key, val] of Object.entries(FlagSchema)) {
		if (!FlagCounts.includes(key)) {
			NewFlags.push(key);
			NewFlagSchema.push([key, val]);
		}
	}

	// check if the last arg is a flag that needs a hint
	
	
	data.flags(NewFlagSchema); // just calling "data.flags(FlagSchema)" adds the flag strings
	// alternatively, a filtered schema can be provided (for instance, if an arg check shows the flag was already 
	// used, you can make a schema without it and call data.flags() with that so it wont show up again)

	const RetStrings = [];
	{
	}
	return RetStrings;
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

/*
	ns.singularity.gymWorkout("Powerhouse Gym", "Strength", true);
	while (ns.getPlayer().skills.strength < CombatSkillTarget) {
		await ns.sleep(5000);
	}
	ns.singularity.gymWorkout("Powerhouse Gym", "Defense", true);
	while (ns.getPlayer().skills.defense < CombatSkillTarget) {
		await ns.sleep(5000);
	}
	ns.singularity.gymWorkout("Powerhouse Gym", "Dexterity", true);
	while (ns.getPlayer().skills.dexterity < CombatSkillTarget) {
		await ns.sleep(5000);
	}
	ns.singularity.gymWorkout("Powerhouse Gym", "Agility", true);
	while (ns.getPlayer().skills.agility < CombatSkillTarget) {
		await ns.sleep(5000);
	}
*/
// strength  "str"
// defense   "def"
// dexterity "dex"
// agility   "agi"

/** @param {NS} ns */
export async function main(ns) {
	const FlagArgs = ns.flags(FlagSchema);
	let scriptName = FlagArgs._[0] ?? "templateCopy.js";
}
