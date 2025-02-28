
/**
 * A Flag Schema is fed to the data.flags() or ns.flags() to parse named and ordered arguments
 * @typedef {[string, string | number | boolean | string[]][]} FlagSchema
 */
const MyFlagSchema = [["argBool", false], ["argNum", 0], ["argStr", ""], ["argStrArr", []], ["help", false],];
//flags(schema: [string, string | number | boolean | string[]][]): { [key: string]: ScriptArg | string[] };

/**
 * This function is called from the terminal after the user types "run scriptName.js ", and then presses the "TAB" key for autocomplete results. 
 *
 * @param {Object} data - Has properties and function:
 * @param {NSEnums} data.enums - Netscript Enums (see ns.enums) 
 * @param {string} data.filename - The filename of the script about to be run (see ns.getScriptName()) 
 * @param {string} data.hostname - The hostname of the server the script would be running on (see ns.getHostname()) 
 * @param {ProcessInfo[]} data.processes - The processes running on this host (see ns.ps()) 
 * @param {string[]} data.scripts - All scripts on the current server 
 * @param {string[]} data.servers - All server hostnames 
 * @param {string[]} data.txts - All text files on the current server 
 * @param {function(FlagSchema): { [key: string]: ScriptArg | string[] }} data.flags - Function that parses the flags schema for flag names (see ns.flags())
 * @param {ScriptArgs[]} args - Arguments that have been added already. 
 * @returns {string[]} A string list of available hints. 
 */
export function autocomplete(data, args) {
  const FlagArgs = data.flags(MyFlagSchema); // simply calling the flags function with the schema adds the flags to the hints
  //return autocomplete_servers(data, args);
  //return autocomplete_files(data, args);
  //return autocomplete_allCompanies(data, args);
  return autocomplete_runningPIDs(data, args);
}

export function autocomplete_servers(data, args) {
  return data.servers;
}

export function autocomplete_files(data, args) {
  const Hints = [...data.scripts, ...data.txts].sort(); // for string arrays, sorts alphabetically
  return Hints;
}

export function autocomplete_allCompanies(data, args) {
  const Hints = [];
  for (let [key, name] of Object.entries(data.enums.CompanyName)) {
    Hints.push(key); // no spaces or terminal-unfriendly characters
    //Hints.push(name); // full string name - consider wraping in quotes?
  }
  return Hints;
}

export function autocomplete_runningPIDs(data, args) {
  const Hints = [];
  for (let proc of data.processes) {
    Hints.push(proc.pid);
  }
  return Hints;
}

/** @param {NS} ns */
export async function main(ns) {
  const FlagArgs = ns.flags(MyFlagSchema);
  let output = `${ns.getScriptName()} arguments:`;
  for (let [key, val] of Object.entries(FlagArgs)) {
    if (key == '_') {
      // no-flag args
      for (let _arg of val) {
        output += `
    ${_arg}`;
      }
    }
    else {
      output += `
  ${key}: ${val}`;
    }
  }
  ns.tprint(output);
}
