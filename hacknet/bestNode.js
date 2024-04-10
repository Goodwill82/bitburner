
/** @param {NS} ns */
export function getNewNodeRating(ns, maxNodes = ns.hacknet.maxNumNodes()) {
  const NewIdx = ns.hacknet.numNodes();
  if (NewIdx >= maxNodes) {
    return null; // can't add another node
  }
  const Gain = ns.formulas.hacknetNodes.moneyGainRate(1, 1, 1, ns.getHacknetMultipliers().production);
  const Cost = ns.formulas.hacknetNodes.hacknetNodeCost(NewIdx + 1, ns.getHacknetMultipliers().purchaseCost);
  return { gpc: (Gain / Cost), cost: Cost, idx: NewIdx, upgrade: "new" };
}

/** @param {NS} ns */
export function getNodeRatingsAt(ns, nIdx) {
  if (nIdx < 0 || nIdx >= ns.hacknet.numNodes()) {
    ns.print("bad nIdx: " + nIdx);
    return null; // node doesn't exist
  }
  const NodeStats = ns.hacknet.getNodeStats(nIdx);
  const HacknetConsts = ns.formulas.hacknetNodes.constants();
  const ProductionMult = ns.getHacknetMultipliers().production;
  const HacknetMults = ns.getHacknetMultipliers();
  // subtract current gain from calculated new gain for each part
  const CurrentGain = ns.formulas.hacknetNodes.moneyGainRate(NodeStats.level, NodeStats.ram, NodeStats.cores, ProductionMult);
  const Ratings = [];

  let gain = 0;
  let cost = 0;
  if (NodeStats.level < HacknetConsts.MaxLevel) {
    gain = ns.formulas.hacknetNodes.moneyGainRate(NodeStats.level + 1, NodeStats.ram, NodeStats.cores, ProductionMult) - CurrentGain;
    cost = ns.formulas.hacknetNodes.levelUpgradeCost(NodeStats.level, 1, HacknetMults.levelCost);
    Ratings.push({ gpc: (gain / cost), cost: cost, idx: nIdx, upgrade: "level" });
  }
  if (NodeStats.ram < HacknetConsts.MaxRam) {
    gain = ns.formulas.hacknetNodes.moneyGainRate(NodeStats.level, NodeStats.ram + 1, NodeStats.cores, ProductionMult) - CurrentGain;
    cost = ns.formulas.hacknetNodes.ramUpgradeCost(NodeStats.ram, 1, HacknetMults.ramCost);
    Ratings.push({ gpc: (gain / cost), cost: cost, idx: nIdx, upgrade: "ram" });
  }
  if (NodeStats.cores < HacknetConsts.MaxCores) {
    gain = ns.formulas.hacknetNodes.moneyGainRate(NodeStats.level, NodeStats.ram, NodeStats.cores + 1, ProductionMult) - CurrentGain;
    cost = ns.formulas.hacknetNodes.coreUpgradeCost(NodeStats.cores, 1, HacknetMults.coreCost);
    Ratings.push({ gpc: (gain / cost), cost: cost, idx: nIdx, upgrade: "cores" });
  }
  return Ratings;
}

/** @param {NS} ns */
export async function main(ns) {
  const Delay_ms = 3000;
  const MaxNodes = 8;
  const MaxFracPlayerMoney = 0.01;
  ns.tail();
  while (true) {
    // get ratings on getting a new node and all the current ratings node
    const Ratings = [];
    let rating = getNewNodeRating(ns, MaxNodes);
    if (rating !== null) {
      Ratings.push(rating);
    }
    for (let idx = 0; idx < ns.hacknet.numNodes(); ++idx) {
      for (let rating of getNodeRatingsAt(ns, idx)) {
        Ratings.push(rating);
      }
    }
    if (Ratings.length < 1) {
      break; // nothing left to buy nor upgrade
    }
    // sort Ratings decending on gain per cost
    Ratings.sort(
      function (x, y) {
        if (y.gpc > x.gpc) {
          return 1;
        }
        if (y.gpc < x.gpc) {
          return -1;
        }
        // if equal, prefer the lower cost
        if (y.cost < x.cost) {
          return 1;
        }
        return 0;
      }
    );
    //for (let rat of Ratings) {
    //  ns.print(rat);
    //}
    //break;
    let maxCost = MaxFracPlayerMoney * ns.getPlayer().money;
    for (let rating of Ratings) {
      if (rating.cost < maxCost) {
        // buy it
        if (rating.upgrade == "new") {
          ns.hacknet.purchaseNode();
        }
        else if (rating.upgrade == "level") {
          ns.hacknet.upgradeLevel(rating.idx);
        }
        else if (rating.upgrade == "ram") {
          ns.hacknet.upgradeRam(rating.idx);
        }
        else if (rating.upgrade == "cores") {
          ns.hacknet.upgradeCore(rating.idx);
        }
        break; // re-evaluate on next loop
      }
    }
    await ns.sleep(Delay_ms);
  }
}
