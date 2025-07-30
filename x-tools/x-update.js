
/**
 * @param {AutocompleteData} data
 * @param {ScriptArgs[]} args - Arguments that have been added already. 
 * @returns {string[]} A string list of available hints. 
 */
export function autocomplete(data, args) {
  return ["ALL",];
}

/** @param {NS} ns */
export function update_all(ns) {
}

/** @param {NS} ns */
export async function main(ns) {
    update_all(ns);
}
