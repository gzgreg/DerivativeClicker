var startPlayer = {
	//currencies
	money: 0.1,
	moneyPerSecond: 0,
	netMoneyPerSecond: 0,
	moneyPerClick: 1,
	moneyPerAutoclick: 0,
	clickPower: 1,
	proofs: 0,
	proofsPerSecond: 0,
	costPerProof: 50,
	deriv1Money: 0.05,
	
	/* main buildings: indexes
	0: deriv1, 1: combinatorics, 2: computer, 3: high schooler, 4: mathematician
	5: deriv2, 6: probability, 7: assembly line, 8: undergraduate, 9: andrew wiles
	10: deriv3, 11: number theory, 12: factory, 13: graduate student, 14: kurt godel
	15: deriv4, 16: calculus, 17: factory architect, 18: postdoc, 19: bernhard riemann 
	20: deriv5, 21: algebra, 22: design school, 23: research scientist, 24: carl gauss
	25: deriv6, 26: geometry, 27: dean of architecture, 28: lab manager, 29: leonhard euler
	30: deriv7, 31: arithmetic, 32: chancellor, 33: research lab, 34: isaac newton
	*/
	buildings: [new Building(1.1, 0.1, 0), new Building(1.1, 25000, 0), new Building(1.3, 0, 3), new Building(1.1, 5, 0), new Building(1.05, 1000, 0),
				 new Building(1.2, 500, 0), new Building(1.3, 20000000, 0), new Building(1.8, 0, 20000), new Building(1.2, 1000, 0), new Building(1.2, 100000000, 0),
				 new Building(1.3, 20000, 0), new Building(1.8, 1000000000, 0), new Building(2.5, 0, 1000000), new Building(1.4, 100000, 0), new Building(1.5, 10000000000000, 0),
				 new Building(1.5, 1000000, 1000), new Building(2.5, 500000000000, 0), new Building(4, 0, 30000000), new Building(2, 10000000, 0), new Building(2, 1000000000000000000, 0),
				 new Building(2, 200000000, 500000), new Building(3, 20000000000000, 0), new Building(5, 0, 1000000000), new Building(2.7, 10000000000, 0), new Building(3, 100000000000000000000000, 0),
				 new Building(2.3, 50000000000, 25000000), new Building(3.5, 10000000000000000, 0), new Building(6, 0, 300000000000), new Building(3.2, 10000000000000, 0), new Building(3.5, 10000000000000000000000000, 0),
				 new Building(2.7, 1000000000000, 1000000000), new Building(4, 500000000000000000, 0), new Building(8, 0, 10000000000000), new Building(3.7, 1000000000000000, 0), new Building(4, 1000000000000000000000000000, 0)],

	/* upgrades: indexes
	tier upgrades: 0: tier 1 upgrade, 1: tier 2 upgrade, 2: tier 3 upgrade, 3: tier 4 upgrade, 4: tier 5 upgrade, 5: tier 6 upgrade, 6: tier 7 upgrade
	upgrades: 0: autoclicker, 1: click improver
	*/	
	tierUpgrades: [0, 0, 0, 0, 0, 0, 0],
	upgrades: [0, 0],
	tierUpgradeCosts: [1000000, 1000000000, 1000000000000, 1000000000000000, 1000000000000000000, 1000000000000000000000, 1000000000000000000000000],
	upgradeCosts: [100000, 10000000],
	
	//upgrade multipliers
	mult: [1, 1, 1, 1, 1, 1, 1],
	
	//other tracking variables
	clickTracker: 0,
	updateInterval: 1000,
	numToBuy: 1,
	timeMult: 1, //note that the period of updates is updateInterval*timeMult
	proofCurrPerTick: 0,
	mathematicianCurrPerTick: 0,
	
	//these variables aren't changed by resets	
	//statistics
	totalMoneyEarned: 0,
	totalProofs: 0,
	totalClicks: 0,
	totalManualClicks: 0,
	totalTicks: 0,
	proofsToNextCurr: 10000000000000,
	proofsToCurrTracker: 0,
	mathematiciansToNextCurr: 7000000000,
	mathematiciansToNextCurrTracker: 0,
	resetCurrTracker: 0, //this variable does have to be reset
	infiniCurr: 0,
	infiniResetDone: false,
	
	//reset currency buyable things: all reset curr stuff is erased by infini-resets
	resetCurrFactor: 5, //integer
	buildingInterval: 10,
	autoclickInterval: 60,
	clicksToGain: 25,
	
	/*reset currency buyables: columns down
	 * 0: tier 5,                  6: click improver stage 1,  12: building tick decrease stage 1, 18: autoclicker tick decrease stage 1
	 * 1: tier 6,                  7: click improver stage 2,  13: building tick decrease stage 2, 19: autoclicker tick decrease stage 2
	 * 2: tier 7,                  8: click improver stage 3,  14: building tick decrease stage 3, 20: autoclicker tick decrease stage 3
	 * 3: factor decrease stage 1, 9: click improver stage 4,  15: building tick decrease stage 4, 21: reset currency conversion factor stage 1
	 * 4: factor decrease stage 2, 10: click improver stage 5, 16: building tick decrease stage 5, 22: reset currency conversion factor stage 2
	 * 5: factor decrease stage 3, 11: click improver stage 6, 17: building tick decrease stage 6, 23: reset currency conversion factor stage 3
	 */
	currBuyables: [new CurrBuyable([10, 0, 0, 0, 0, 0]), new CurrBuyable([0, 50, 0, 0, 0, 0]), new CurrBuyable([0, 0, 100, 0, 0, 0]), new CurrBuyable([0, 0, 0, 100, 0, 0]), new CurrBuyable([0, 0, 0, 0, 100, 0]), new CurrBuyable([0, 0, 0, 0, 0, 100]),
	               new CurrBuyable([1e3, 0, 0, 0, 0, 0]), new CurrBuyable([0, 1e3, 0, 0, 0, 0]), new CurrBuyable([0, 0, 2e3, 0, 0, 0]), new CurrBuyable([0, 0, 0, 5e3, 0, 0]), new CurrBuyable([0, 0, 0, 0, 1e4, 0]), new CurrBuyable([0, 0, 0, 0, 0, 2e4]),
				   new CurrBuyable([1e5, 0, 0, 0, 0, 0]), new CurrBuyable([0, 1e5, 0, 0, 0, 0]), new CurrBuyable([0, 0, 2e5, 0, 0, 0]), new CurrBuyable([0, 0, 0, 2e5, 0, 0]), new CurrBuyable([0, 0, 0, 0, 5e5, 0]), new CurrBuyable([0, 0, 0, 0, 0, 5e5]),
	               new CurrBuyable([1e7, 0, 0, 0, 0, 0]), new CurrBuyable([0, 1e7, 0, 0, 0, 0]), new CurrBuyable([0, 0, 2e7, 0, 0, 0]), new CurrBuyable([0, 0, 0, 1e9, 0, 0]), new CurrBuyable([0, 0, 0, 0, 2e9, 0]), new CurrBuyable([0, 0, 0, 0, 0, 5e9])],
	
	achievements: [new Achievement("First Click", "Click for the first time!", "player.totalManualClicks > 0"), new Achievement("Clicking 'Expert'", "Click 100 times", "player.totalManualClicks > 100"),
				   new Achievement("Needs More Click", "Click 1000 times", "player.totalManualClicks > 1000"), new Achievement("Algorithmic Clicker", "Click 10000 times", "player.totalManualClicks > 10000"),
				   new Achievement("Clickmeister", "Click 100000 times", "player.totalManualClicks > 100000"), new Achievement("Clickmaster", "Click 1 million times", "player.totalManualClicks > 1e6"),
				   new Achievement("You're Probably Autoclicking", "Click 10 million times", "player.totalManualClicks > 1e7"), new Achievement("It begins...", "Buy a first derivative", "player.buildings[0].manual > 0"),
				   new Achievement("Quadratic Growth", "Buy a second derivative", "player.buildings[5].manual > 0"), new Achievement("Cubic Growth", "Buy a third derivative", "player.buildings[10].manual > 0"),
				   new Achievement("Quartic Growth", "Buy a fourth derivative", "player.buildings[15].manual > 0"), new Achievement("Quintic Growth", "Buy a fifth derivative", "player.buildings[20].manual > 0"),
				   new Achievement("Sextic Growth", "Buy a sixth derivative", "player.buildings[25].manual > 0"), new Achievement("Septic Growth", "Buy a seventh derivative", "player.buildings[30].manual > 0"),
				   new Achievement("Fermat's Last Theorem", "Have an Andrew Wiles", "player.buildings[9].owned > 0"), new Achievement("Incompleteness Theorem", "Have a Kurt Godel", "player.buildings[14].owned > 0"),
				   new Achievement("Riemann Sums", "Have a Bernhard Riemann", "player.buildings[19].owned > 0"), new Achievement("Fundamental Theorem of Algebra", "Have a Carl Gauss", "player.buildings[24].owned > 0"),
				   new Achievement("Euler's Identity", "Have a Leonhard Euler", "player.buildings[29].owned > 0"), new Achievement("Calculus", "Have an Isaac Newton", "player.buildings[34].owned > 0"),
				   new Achievement("Start From Scratch", "Do a tier 1 reset", "player.numResets[0] > 0"), new Achievement("High Tier", "Do a tier 6 reset", "player.numResets[5] > 0"),
				   new Achievement("Millionaire", "Make a million dollars in total", "player.totalMoneyEarned > 1e6"), new Achievement("Billionaire", "Make a billion dollars in total", "player.totalMoneyEarned > 1e9"),
				   new Achievement("...Quadrillionaire?", "Make a quadrillion dollars in total", "player.totalMoneyEarned > 1e15"), new Achievement("Decillionaire", "Make a decillion dollars in total", "player.totalMoneyEarned > 1e33"),
				   new Achievement("Vigintillionaire", "Make a vigintillion dollars in total", "player.totalMoneyEarned > 1e63"), new Achievement("Yeah this isn't a real thing", "Make a trigintillion dollars in total", "player.totalMoneyEarned > 1e93"),
				   new Achievement("Centillionaire", "Make a centillion dollars in total", "player.totalMoneyEarned > 1e303")],
	//settings
	sciNotation: false,
	minTickLength: 100,
	chartDelay: 10000,
	chartLength: 100,
	
	//the next two variables are erased by infini-resets
	numResets: [0, 0, 0, 0, 0, 0, 0],
	resetCurr: [0, 0, 0, 0, 0, 0, 0],
	versionNum: versionNum
};

var resetPlayer = {
	money: 0.1,
	moneyPerSecond: 0,
	netMoneyPerSecond: 0,
	moneyPerClick: 1,
	clickPower: 1,
	moneyPerAutoclick: 0,
	proofs: 0,
	proofsPerSecond: 0,
	costPerProof: 5,
	deriv1Money: 0.05,
	buildings: [new Building(1.1, 0.1, 0), new Building(1.1, 25000, 0), new Building(1.3, 0, 3), new Building(1.1, 5, 0), new Building(1.05, 1000, 0),
				 new Building(1.2, 500, 0), new Building(1.3, 20000000, 0), new Building(1.8, 0, 20000), new Building(1.2, 1000, 0), new Building(1.2, 100000000, 0),
				 new Building(1.3, 20000, 0), new Building(1.8, 1000000000, 0), new Building(2.5, 0, 1000000), new Building(1.4, 100000, 0), new Building(1.5, 10000000000000, 0),
				 new Building(1.5, 1000000, 1000), new Building(2.5, 500000000000, 0), new Building(4, 0, 30000000), new Building(2, 10000000, 0), new Building(2, 1000000000000000000, 0),
				 new Building(2, 200000000, 500000), new Building(3, 20000000000000, 0), new Building(5, 0, 1000000000), new Building(2.7, 10000000000, 0), new Building(3, 100000000000000000000000, 0),
				 new Building(2.3, 50000000000, 25000000), new Building(3.5, 10000000000000000, 0), new Building(6, 0, 300000000000), new Building(3.2, 10000000000000, 0), new Building(3.5, 10000000000000000000000000, 0),
				 new Building(2.7, 1000000000000, 1000000000), new Building(4, 500000000000000000, 0), new Building(8, 0, 10000000000000), new Building(3.7, 1000000000000000, 0), new Building(4, 1000000000000000000000000000, 0)],
	tierUpgrades: [0, 0, 0, 0, 0, 0, 0],
	upgrades: [0, 0],
	tierUpgradeCosts: [1e6, 1e9, 1e12, 1e15, 1e18, 1e21, 1e24],
	upgradeCosts: [100000, 10000000],
	mult: [1, 1, 1, 1, 1, 1, 1],
	clickTracker: 0,
	updateInterval: 1000,
	timeMult: 1,
	resetCurrTracker: 0,
	proofCurrPerTick: 0,
	mathematicianCurrPerTick: 0
}

var infiniResetPlayer = {
	money: 0.1,
	moneyPerSecond: 0,
	netMoneyPerSecond: 0,
	moneyPerClick: 1,
	clickPower: 1,
	moneyPerAutoclick: 0,
	proofs: 0,
	proofsPerSecond: 0,
	costPerProof: 5,
	deriv1Money: 0.05,
	buildings: [new Building(1.1, 0.1, 0), new Building(1.1, 25000, 0), new Building(1.3, 0, 3), new Building(1.1, 5, 0), new Building(1.05, 1000, 0),
				 new Building(1.2, 500, 0), new Building(1.3, 20000000, 0), new Building(1.8, 0, 20000), new Building(1.2, 1000, 0), new Building(1.2, 100000000, 0),
				 new Building(1.3, 20000, 0), new Building(1.8, 1000000000, 0), new Building(2.5, 0, 1000000), new Building(1.4, 100000, 0), new Building(1.5, 10000000000000, 0),
				 new Building(1.5, 1000000, 1000), new Building(2.5, 500000000000, 0), new Building(4, 0, 30000000), new Building(2, 10000000, 0), new Building(2, 1000000000000000000, 0),
				 new Building(2, 200000000, 500000), new Building(3, 20000000000000, 0), new Building(5, 0, 1000000000), new Building(2.7, 10000000000, 0), new Building(3, 100000000000000000000000, 0),
				 new Building(2.3, 50000000000, 25000000), new Building(3.5, 10000000000000000, 0), new Building(6, 0, 300000000000), new Building(3.2, 10000000000000, 0), new Building(3.5, 10000000000000000000000000, 0),
				 new Building(2.7, 1000000000000, 1000000000), new Building(4, 500000000000000000, 0), new Building(8, 0, 10000000000000), new Building(3.7, 1000000000000000, 0), new Building(4, 1000000000000000000000000000, 0)],
	tierUpgrades: [0, 0, 0, 0, 0, 0, 0],
	upgrades: [0, 0],
	tierUpgradeCosts: [1e6, 1e9, 1e12, 1e15, 1e18, 1e21, 1e24],
	upgradeCosts: [100000, 10000000],
	mult: [1, 1, 1, 1, 1, 1, 1],
	clickTracker: 0,
	updateInterval: 1000,
	timeMult: 1,
	proofsToNextCurr: 10000000000000,
	proofsToCurrTracker: 0,
	mathematiciansToNextCurr: 7000000000,
	mathematiciansToNextCurrTracker: 0,
	totalMoneyEarned: 0,
	totalProofs: 0,
	totalClicks: 0,
	totalManualClicks: 0,
	totalTicks: 0,
	resetCurrTracker: 0,
	proofCurrPerTick: 0,
	mathematicianCurrPerTick: 0,
	resetCurrFactor: 5,
	buildingInterval: 10,
	autoclickInterval: 60,
	clicksToGain: 25,
	currBuyables: [new CurrBuyable([10, 0, 0, 0, 0, 0]), new CurrBuyable([0, 50, 0, 0, 0, 0]), new CurrBuyable([0, 0, 100, 0, 0, 0]), new CurrBuyable([0, 0, 0, 100, 0, 0]), new CurrBuyable([0, 0, 0, 0, 100, 0]), new CurrBuyable([0, 0, 0, 0, 0, 100]),
	               new CurrBuyable([1e3, 0, 0, 0, 0, 0]), new CurrBuyable([0, 1e3, 0, 0, 0, 0]), new CurrBuyable([0, 0, 2e3, 0, 0, 0]), new CurrBuyable([0, 0, 0, 5e3, 0, 0]), new CurrBuyable([0, 0, 0, 0, 1e4, 0]), new CurrBuyable([0, 0, 0, 0, 0, 2e4]),
				   new CurrBuyable([1e5, 0, 0, 0, 0, 0]), new CurrBuyable([0, 1e5, 0, 0, 0, 0]), new CurrBuyable([0, 0, 2e5, 0, 0, 0]), new CurrBuyable([0, 0, 0, 2e5, 0, 0]), new CurrBuyable([0, 0, 0, 0, 5e5, 0]), new CurrBuyable([0, 0, 0, 0, 0, 5e5]),
	               new CurrBuyable([1e7, 0, 0, 0, 0, 0]), new CurrBuyable([0, 1e7, 0, 0, 0, 0]), new CurrBuyable([0, 0, 2e7, 0, 0, 0]), new CurrBuyable([0, 0, 0, 1e9, 0, 0]), new CurrBuyable([0, 0, 0, 0, 2e9, 0]), new CurrBuyable([0, 0, 0, 0, 0, 5e9])],
   	numResets: [0, 0, 0, 0, 0, 0, 0],
	resetCurr: [0, 0, 0, 0, 0, 0, 0]
}

var versionNum = 0.341;

//these variables hold constants between plays
var upgradeCostFactor = [1.5, 100];

var globalMult = [1, 1, 1, 1, 1, 1, 1];

var numTiers = 7;
