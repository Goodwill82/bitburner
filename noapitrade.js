import * as ms from "/mystuff.js";
import { setTab } from "/uutil.js";

let inHand = 0.11; // % of funds to keep in hand. Default 0.25
let numCyclesToProject = 2; // Only buy stocks that are projected to increase for this amount of cycles. Recommended 2-5. Default 2
let expectedRetentionLossToSell = -0.40; // Percent change between initial forecast and current forcast. ie if current forecast is 40% worse than initial, sell. Default -0.40
let commission = 100000; // Current Buy/Sell Comission cost

const SaveEarningsFile = "/save/stock.txt"
const StopBuyingAndClose = "/stoptrade.txt"

/** @param {NS} ns */
function pChange(ns, sym, oldNum, newNum) {
	const diff = newNum < oldNum ? -(oldNum - newNum) : newNum - oldNum;
	let pdiff = diff / oldNum;
	ns.print(` ${sym}:\t| ${oldNum.toFixed(5)} -> ${newNum.toFixed(5)}\t| ${(pdiff * 100).toFixed(3)}%`);
	return pdiff
}

/** @param {NS} ns */
async function getProbsVolsFromPage(ns, collapsed = false) {
	setTab("Stock Market", false);
	await ns.sleep(200);
	const VolFore = [];
	const docLines = document.body.innerText.split('\n');
	const RegexStr = /^[a-zA-Z'\s]*\b([A-Z]+)\b\s+-.+Volatility:\s+([0-9]\.[0-9]+).+Price Forecast:\s+(.+)$/;
	for (let line of docLines) {
		line = line.trim();
		let found = line.match(RegexStr);
		if (found) {
			//ns.print(`${found[1]} ${found[2]} ${found[3]}`);
			let fc = found[3].length / 5;
			if (found[3].charAt(0) == '-') {
				fc *= -1;
			}
			//fc = (fc + 1) * 0.5; // make it in range [0,1]
			//VolFore.push({ sym: found[1], volatility: found[2], forecast: fc })
			VolFore.push({ sym: found[1], volatility: found[2] / 100, forecast: fc })
		}
	}
	return VolFore;
}

/** @param {NS} ns */
async function getStocks(ns, stocks, myStocks) {
	let volFore = await getProbsVolsFromPage(ns);
	let corpus = ns.getServerMoneyAvailable("home");
	myStocks.length = 0;
	for (let i = 0; i < stocks.length; i++) {
		let sym = stocks[i].sym;
		stocks[i].askPrice = ns.stock.getAskPrice(sym);
		stocks[i].bidPrice = ns.stock.getBidPrice(sym);
		stocks[i].shares = ns.stock.getPosition(sym)[0];
		stocks[i].buyPrice = ns.stock.getPosition(sym)[1];
		for (let vf of volFore) {
			if (vf.sym == sym) {
				stocks[i].vol = vf.volatility
				//stocks[i].prob = 2 * (vf.forecast - 0.5);
				stocks[i].prob = vf.forecast;
				break;
			}
		}
		//stocks[i].vol = ns.stock.getVolatility(sym);
		//stocks[i].prob = 2 * (ns.stock.getForecast(sym) - 0.5);
		stocks[i].expRet = stocks[i].vol * stocks[i].prob / 2;
		if (stocks[i].shares > 0) {
			stocks[i].initExpRet ||= stocks[i].expRet;
		} else {
			stocks[i].initExpRet = null;
		}

		//corpus += stocks[i].buyPrice * stocks[i].shares;
		corpus += stocks[i].bidPrice * stocks[i].shares;
		if (stocks[i].shares > 0) myStocks.push(stocks[i]);
	}
	stocks.sort(function (a, b) { return b.expRet - a.expRet });
	return corpus;
}

/** @param {NS} ns */
function buy(ns, stock, numShares) {
	const max = ns.stock.getMaxShares(stock.sym)
	numShares = max < numShares ? max : numShares;

	let total = ns.stock.buyStock(stock.sym, numShares) * numShares;
	ns.print(`Bought ${stock.sym} for ${ms.fMoney(total + commission)}`);
}

/** @param {NS} ns */
function sell(ns, stock, numShares) {
	let profit = ns.stock.sellStock(stock.sym, numShares) * numShares;
	ns.print(`Sold ${stock.sym} for profit of ${ms.fMoney(profit - commission)}`);
}

/** @param {NS} ns */
export async function main(ns) {
	let sellOff = false;
	let unexpectedExit = false;
	ns.disableLog("ALL");
	ns.tail();

	let stocks = [...ns.stock.getSymbols().map(_sym => { return { sym: _sym } })];
	let myStocks = [];
	let corpus = 0;
	while (true) {
		let updatePromise = ns.stock.nextUpdate(); // wait after calcs

		corpus = await getStocks(ns, stocks, myStocks);
		if (sellOff && myStocks.length < 1) {
			ns.rm(SaveEarningsFile); // clear this up now
			ns.rm(StopBuyingAndClose);
			unexpectedExit = true;
			ns.tail();
			ns.print("All stocks have been sold off, and the flag file has been removed. Final totals:");
			ns.print(`Total Money  :${ms.fMoney(corpus)}`);
			ns.exit();
		}
		//Symbol, Initial Return, Current Return, The % change between
		// the Initial Return and the Current Return.
		ns.print("Currently Owned Stocks:");
		ns.print(" SYM\t| InitReturn -> CurReturn | % change");

		//Sell underperforming shares
		for (let i = 0; i < myStocks.length; i++) {
			if (pChange(ns, myStocks[i].sym, myStocks[i].initExpRet, myStocks[i].expRet) <= expectedRetentionLossToSell)
				sell(ns, myStocks[i], myStocks[i].shares);

			if (myStocks[i].expRet <= 0)
				sell(ns, myStocks[i], myStocks[i].shares);

			corpus -= commission;
		}

		ns.print("----------------------------------------");

		ns.print(" SYM\t| $ invested\t| $ profit");
		for (let i = 0; i < myStocks.length; i++) {
			ns.print(` ${myStocks[i].sym}:\t| ${ms.fMoney(myStocks[i].shares * myStocks[i].buyPrice)}\t| ${ms.fMoney((myStocks[i].shares * (myStocks[i].bidPrice - myStocks[i].buyPrice)) - (2 * commission))}`);
		}

		ns.print("________________________________________");

		//Buy shares with cash remaining in hand

		if (!sellOff) {
			if (ns.fileExists(StopBuyingAndClose)) {
				sellOff = true;
				ns.tail();
				continue;
			}
			else {
				for (let stock of stocks) {
					if (stock.shares > 0) continue;
					if (stock.expRet <= 0) continue;
					let cashToSpend = ns.getServerMoneyAvailable("home") - (inHand * corpus);
					let numShares = Math.floor((cashToSpend - commission) / stock.askPrice);
					if ((numShares * stock.expRet * stock.askPrice * numCyclesToProject) > (commission * 2))
						buy(ns, stock, numShares);
					break;
				}
			}
		}
		if (sellOff) {
			ns.print("Will stop buying and sell off stocks when profitable.");
		}
		ns.print(`Total Money  :${ms.fMoney(corpus)}`);

		await updatePromise; // finish first wait, wait for any additional
		for (let ii = 1; ii < numCyclesToProject; ++ii) {
			await ns.stock.nextUpdate();
		}
	}
}
