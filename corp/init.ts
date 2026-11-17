//import { CorpName } from "corp/init.ts";

export const CorpName = "corpo";

export async function main(ns: NS) {
  let selfFund = true;
  let result = ns.corporation.canCreateCorporation();
  if (result === "Success" && ns.corporation.canCreateCorporation(true) === "Success") {
    selfFund = false;
  }
  if (result !== "Success") {
    ns.tprint(`WARNING: Could not start a corporation. Reason: ${result}.`);
    ns.exit();
  }
  if (!ns.corporation.createCorporation(CorpName, selfFund)) {
    ns.tprint("WARNING: Could not start a corporation. Likely reason: lack of funds.");
    ns.exit();
  }
  ns.tprint(`Started company "${CorpName}". run gang/agricultureInit.ts`);
}

//type CreatingCorporationCheckResultEnumType = {
//  Success: "Success";
//  NoSf3OrDisabled: "NoSf3OrDisabled";
//  CorporationExists: "CorporationExists";
//  UseSeedMoneyOutsideBN3: "UseSeedMoneyOutsideBN3";
//  DisabledBySoftCap: "DisabledBySoftCap";
//};
