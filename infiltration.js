export function fMoney(number) {
    const MoneySuffixList = ["", "k", "m", "b", "t", "q", "Q", "s", "S", "o", "n"];
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

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");
    ns.clearLog();
    ns.tail();
    let printLengths = { city: "City".length, name: "Location".length, difficulty: "Difficulty".length, repSoA: "SoA Rep".length, repOther: "Trade Rep".length, sellCash: "Cash".length };
    let locInfo = [];
    for (let loc of ns.infiltration.getPossibleLocations()) {
        let info = ns.infiltration.getInfiltration(loc.name);
        let reward = info.reward;
        let denom = Number.EPSILON;
        if (info.difficulty > denom) {
            denom = info.difficulty;
        }
        let obj = { city: loc.city, name: loc.name, difficulty: info.difficulty, repSoA: reward.SoARep, repOther: reward.tradeRep, sellCash: reward.sellCash, repOverDifficulty: (reward.tradeRep / denom) };
        locInfo.push(obj);

        // keep track of sizing for formatted printing
        let strlen = obj.city.length;
        if (printLengths.city < strlen) {
            printLengths.city = strlen;
        }
        strlen = obj.name.length;
        if (printLengths.name < strlen) {
            printLengths.name = strlen;
        }
        strlen = obj.difficulty.toFixed(6).length;
        //strlen = obj.difficulty.toExponential(32).length;
        if (printLengths.difficulty < strlen) {
            printLengths.difficulty = strlen;
        }
        strlen = obj.repSoA.toFixed(0).length;
        if (printLengths.repSoA < strlen) {
            printLengths.repSoA = strlen;
        }
        strlen = obj.repOther.toFixed(0).length;
        if (printLengths.repOther < strlen) {
            printLengths.repOther = strlen;
        }
        strlen = fMoney(obj.sellCash).length;
        if (printLengths.sellCash < strlen) {
            printLengths.sellCash = strlen;
        }
    }
    for (let [key, val] of Object.entries(printLengths)) {
        printLengths[key] = val + 2; // add padding
    }
    locInfo.sort(function (a1, a2) { return a1.difficulty - a2.difficulty });
    ns.print(`${"City".padEnd(printLengths.city)}${"Location".padEnd(printLengths.name)}${"Difficulty".padEnd(printLengths.difficulty)}${"SoA Rep".padEnd(printLengths.repSoA)}${"Trade Rep".padEnd(printLengths.repOther)} ${"Cash".padEnd(printLengths.sellCash)} TradeRep/Diff`);
    for (let info of locInfo) {
        ns.print(`${info.city.padEnd(printLengths.city)}${info.name.padEnd(printLengths.name)}${info.difficulty.toFixed(6).padEnd(printLengths.difficulty)}${info.repSoA.toFixed(0).padEnd(printLengths.repSoA)}${info.repOther.toFixed(0).padEnd(printLengths.repOther)}${fMoney(info.sellCash).padEnd(printLengths.sellCash)}  ${info.repOverDifficulty.toExponential(2)}`);
    }
}
