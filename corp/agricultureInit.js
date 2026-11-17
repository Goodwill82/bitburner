import { CorpName } from "corp/init.ts";

export const AgricultureDivName = "agrico";

export async function main(ns: NS) {
  if (!ns.corporation.hasCorporation()) {
    ns.tprint("ERROR: You must have a corporation to run this script.");
    ns.exit();
  }
  let corpInfo = ns.corporation.getCorporation();
  for (const divName of corpInfo.divisions) {
    if (divName === AgricultureDivName) {
      ns.tprint(`ERROR: Your corporation already has an Agriculture division named "${AgricultureDivName}".`);
      ns.exit();
    }
    //if (ns.corporation.getDivision(divName).industry === "Agriculture") {
    //  ns.tprint(`ERROR: Your corporation already has an Agriculture division named "${divName}".`);
    //  ns.exit();
    }
  }
  let numDivs = corpInfo.divisions.length;
  ns.corporation.expandIndustry("Agriculture", AgricultureDivName);
  corpInfo = ns.corporation.getCorporation();
  if (numDivs >= corpInfo.divisions.length) {
    ns.tprint("ERROR: Could not start new Agriculture division.");
    ns.exit();
  }
}

//type CorpIndustryName =
//  | "Water Utilities"
//  | "Agriculture"
//  | "Fishing"
//  | "Mining"
//  | "Refinery"
//  | "Restaurant"
//  | "Tobacco"
//  | "Chemical"
//  | "Pharmaceutical"
//  | "Computer Hardware"
//  | "Robotics"
//  | "Software"
//  | "Healthcare"
//  | "Real Estate";
