/* Todo: add more statistics, ???add upgrade paths????, add more derivatives
Rollover hilarious jokes/stats
Reset currency buyables: change click improver to reset curr buyable, ticks between builds decrease, upgrades influenced by certain buildings
*/

var player = deepObjCopy(startPlayer);

var isActive = true;

window.onfocus = function(){isActive = true;};
window.onblur = function(){isActive=false;};

//functions that add to variables
function addMoney(money) {
	player.money = Math.round((player.money + money)*100)/100;
	if(money > 0){
		player.totalMoneyEarned = Math.round((player.totalMoneyEarned + money)*100)/100;
	}
	if(player.money < 0) player.money = 0;
}

function addMoneyPerSecond(mps){
	player.moneyPerSecond = Math.round((player.moneyPerSecond + mps)*100)/100;
}

function addNetMoneyPerSecond(nmps){
	player.netMoneyPerSecond = Math.round((player.netMoneyPerSecond + nmps)*100)/100;
}

function addMoneyPerClick(mpc){
	player.moneyPerClick = Math.round((player.moneyPerClick + mpc)*100)/100;
}

function addProofs(proofs){
	player.proofs += Math.round(proofs);
	player.proofsToNextCurr -= Math.round(proofs);
	player.totalProofs += Math.round(proofs);
	addMoney(-Math.round(proofs) * player.costPerProof);
}

//function to display values
function displayNum(num, ifMoney){
	displayNum.suffixes = ["K", "M", "B", "T", "Qa", "Qt", "Sx", "Sp", "Oc", "Nn", "Dc", "UDc", "DDc", "TDc", "QaDc", "QtDc", "SxDc", "SpDc", "ODc", "NDc", "Vi", 
						   "UVi", "DVi", "TVi", "QaVi", "QtVi", "SxVi", "SpVi", "OcVi", "NnVi", "Tg", "UTg", "DTg", "TTg", "QaTg", "QtTg", "SxTg", "SpTg", "OcTg", "NnTg", "Qd",
						   "UQd", "DQd", "TQd", "QaQd", "QtQd", "SxQd", "SpQd", "OcQd", "NnQd", "Qq", "UQq", "DQq", "TQq", "QaQq", "QtQq", "SxQq", "SpQq", "OcQq", "NnQq", "Sg"]
	
	if(player.sciNotation) return Math.abs(num) < 100000 ? (ifMoney ? parseFloat(num).toFixed(2) : num) : parseFloat(num).toPrecision(5);
	
	for(var i = displayNum.suffixes.length - 1; i >= 0; i--){
		if(Math.abs(num) >= Math.pow(10, 3*i + 3) * 0.99999){
			return i < 4 ? parseFloat(num/Math.pow(10, 3*i + 3)).toFixed(2) + displayNum.suffixes[i] : parseFloat(num/Math.pow(10, 3*i + 3)).toFixed(2) + " " + displayNum.suffixes[i]; //spaces out first four suffixes
		}
	}
	
	return ifMoney ? parseFloat(num).toFixed(2) : num;
}

//function that recalculates the multipliers associated with upgrades
function calcMult(mult){
	var index = mult - 1;
	
	calcMult.factors = [(player.infiniCurr/10000) + 0.0005, (player.infiniCurr/1000) + 0.002, (player.infiniCurr/1000) + 0.005, (player.infiniCurr/100) + 0.01, (player.infiniCurr/100) + 0.02, (player.infiniCurr/100) + 0.04, (player.infiniCurr/100) + 0.06];
	var totalBuildings = 0;
	
	for(var i = mult*5 - 5; i < mult*5; i++){
		totalBuildings += player.buildings[i].manual;
	}
	
	player.mult[index] = Math.round(10000 + (player.tierUpgrades[index] * calcMult.factors[index] * totalBuildings * 10000)) / 10000;
}

function calcGlobalMult(){
	for(var i = 0; i < globalMult.length; i++){
		globalMult[i] = parseFloat((player.resetCurr[i] * 0.01) + 1).toFixed(2);
	}
}

//function that calculates price of buying multiple buildings at once
function calcTotalPrice(price, factor, number){
	return price*((Math.pow(factor, number) - 1)/(factor - 1));
}

function checkAchievement(index){
	var achievement = player.achievements[index];
	if(achievement.achieved) return;
	else{
		if(achievement.condition()){
			achievement.achieved = true;
			achievement.time = new Date();
		}
	}
}

//function that allows number to buy to be adjusted
function getNumToBuy(num){
    var activeTab = $("#tabs").tabs("option", "active");
	if(num === -1){
		player.numToBuy = "Max";
	}
	else{
		var newNum = parseInt(num);
		if(!isNaN(newNum) && newNum > 0){
			player.numToBuy = newNum;
		}
	}
    $("#currentNumToBuy").html(player.numToBuy);
	$("#currentNumToBuy2").html(player.numToBuy);
	if(activeTab == 0) updateInventory();
}

function factorial(n){
	if(n <= 1) return 1;
	return n*factorial(n-1);
}

function cloneFunc(someFunc) {
    var someFuncAsText = someFunc.toString();

    return new Function
    (
        /\(([\s\S]*?)\)/.exec(someFunc)[1],
        someFuncAsText.substring(someFuncAsText.indexOf("{") + 1, someFuncAsText.lastIndexOf("}"))
    );
}

function deepObjCopy (dupeObj) {
    var retObj = new Object();
    if (typeof(dupeObj) == 'object') {
        if (typeof(dupeObj.length) != 'undefined')
            var retObj = new Array();
        for (var objInd in dupeObj) {   
            if (typeof(dupeObj[objInd]) == 'object') {
                retObj[objInd] = deepObjCopy(dupeObj[objInd]);
            } else if(typeof(dupeObj[objInd]) == 'function') {
            	retObj[objInd] = cloneFunc(dupeObj[objInd]);
            } else if (typeof(dupeObj[objInd]) == 'string') {
                retObj[objInd] = dupeObj[objInd];
            } else if (typeof(dupeObj[objInd]) == 'number') {
                retObj[objInd] = dupeObj[objInd];
            } else if (typeof(dupeObj[objInd]) == 'boolean') {
                ((dupeObj[objInd] == true) ? retObj[objInd] = true : retObj[objInd] = false);
            }
        }
    }
    return retObj;
}

//functions that handle saving
function init(){
	player = deepObjCopy(startPlayer);
};

function save() {
	localStorage.setItem("playerStored", JSON.stringify(player));
	localStorage.setItem("enableChart", JSON.stringify(enableChart));
	
	var d = new Date();
	$("#lastSave").html(d.toLocaleTimeString());
	
	ga('send', 'event', 'save', 'click', 'save'); //analytics
}

function load() {
	$.extend(true, player, JSON.parse(localStorage.getItem("playerStored")));
	enableChart = JSON.parse(localStorage.getItem("enableChart"));
}

function wipe() {
	var confirmation = confirm("Are you sure you want to permanently erase your savefile?");
	if(confirmation === true){
		init();
		localStorage.setItem("playerStored", JSON.stringify(player));
		calcGlobalMult();
		$("#achievementContainer").html("");
		
		updateAll();
		$("#currentNumToBuy").html(player.numToBuy);
	}
}

function exportSave() {
	var exportText = btoa(JSON.stringify(player));
	
	$("#exportSaveContents").toggle();
	$("#exportSaveText").val(exportText);
	$("#exportSaveText").select();
}

function importSave(){
	var importText = prompt("Paste the text you were given by the export save dialog here.\n" +
								"Warning: this will erase your current save!");
	if(importText){
		init();
		$.extend(true, player, JSON.parse(atob(importText)));
		versionControl(true);
		fixJSON();
		save();
		calcGlobalMult();
		$("#currentNumToBuy").html(player.numToBuy);
		
		updateAll();
	}
}

function fixJSON(){
	for(var i = 0; i < player.achievements.length; i++){
		if(typeof(player.achievements[i].time) != 'undefined'){
			player.achievements[i].time = new Date(player.achievements[i].time);
		}
	}
}

function toggleSciNotation(){
	player.sciNotation = !player.sciNotation;
	updateResetCurrBuyablesTitles();
    updateResetCurrBuyables();
}

function setMinTickLength(){
    var minTickLength;
    do{
        minTickLength = prompt("Enter a new minimum tick length between 10 and 1000 (noninclusive).");
    } while((minTickLength >= 1000 || minTickLength <= 10) && minTickLength != null)
    
    if(minTickLength == null) return;
    
    player.minTickLength = minTickLength;
    player.timeMult = 1;
    while(player.updateInterval * player.timeMult < player.minTickLength) player.timeMult *= 1000 / player.minTickLength;
    $("#minTickLength").html(minTickLength);
}

function ifMoreDerivs(tier){
	if(player.numResets[tier - 1] == 0 && tier <= 3) return "Access to another derivative.\n"
	return "";
}

function reset(tier) {
	var index = tier - 1;
	
	if(player.buildings[4 + 5 * index].owned < 7000000000){
		alert("You must have" + displayNum(7e9, false) + "mathematicians of tier " + tier + " to do this!")
	}
	else{
		var confirmationText = "Are you sure you want to reset? You will gain: \n";
		
		confirmationText += (displayNum(player.resetCurrTracker, false) + " tier 1 reset currency.\n");
		if(tier > 1){
			for(var i = 1; i < tier; i++){
				confirmationText += (displayNum(Math.floor(player.resetCurr[i- 1] / player.resetCurrFactor, false)) + " tier " + (i + 1) + " reset currency.\n");
				confirmationText += ("At the cost of " + displayNum(Math.floor(player.resetCurr[i - 1] / player.resetCurrFactor) * player.resetCurrFactor, false) + " tier " + i + " reset currency.\n");
			}
		}
				
		confirmationText += "\n\nYes, I know this looks pretty awful. If you have any ideas on how to restructure the text here I\'m all ears."
		
		var confirmation = confirm(confirmationText);
		
		if(confirmation === true){
			player.numResets[index]++;
			if(tier > 1){
				for(var i = index; i > 0; i--){
					player.resetCurr[i] += Math.floor(player.resetCurr[i - 1] / player.resetCurrFactor);
					player.resetCurr[i - 1] %= player.resetCurrFactor;
				}
			}
			player.resetCurr[0] += player.resetCurrTracker;
			calcGlobalMult();
			
			//resets variables that are erased by reset
			$.extend(true, player, deepObjCopy(resetPlayer));
			
			if(player.currBuyables[3].owned){
				for (var i = 0; i < player.buildings.length; i++){
					player.buildings[i].factor = 1 + (player.buildings[i].factor - 1) / 1.1;
				}
				if(player.currBuyables[4].owned){
					for (var i = 0; i < player.buildings.length; i++){
						player.buildings[i].factor = 1 + (player.buildings[i].factor - 1) / 1.1;
					}
					if(player.currBuyables[5].owned){
						for (var i = 0; i < player.buildings.length; i++){
							player.buildings[i].factor = 1 + (player.buildings[i].factor - 1) / 1.1;
						}
					}
				}
			}
			player.clickPower = player.infiniCurr;
			updateAll();
			
			ga('send', 'event', 'reset', 'click', 'reset'); //analytics
		}
	}
}

function infiniReset(){
	if(!player.infiniResetDone){
		alert("You have reached infinite money! This automatically triggers an infini-reset, and unlocks a new tab in the interface."
				+"\n This will happen automatically in the future.");
		player.infiniResetDone = true;
	}
	
	$.extend(true, player, deepObjCopy(infiniResetPlayer));
	player.infiniCurr++;
	for(i = 1; i <= numTiers; i++){
		calcMult(i);
	}
	calcGlobalMult();
	updateAll();
}


//templates
var moneyTableTemplate = _.template($("#moneyTableTemplate").html());
var inventoryTemplate = _.template($("#inventoryTemplate").html());
var row5Template = _.template($("#row5Template").html())
var row6Template = _.template($("#row6Template").html())
var row7Template = _.template($("#row7Template").html())
var upgradesTemplate = _.template($("#upgradesTemplate").html());
var statsTemplate = _.template($("#statsTemplate").html());
var prestigeTemplate = _.template($("#prestigeTemplate").html());
var infiniTemplate = _.template($("#infiniTemplate").html());

//functions that update stuff onscreen
function updateMoney() {
	var newMoneyTable = moneyTableTemplate({money: displayNum(player.money, true), moneyPerSecond: displayNum(player.moneyPerSecond, true), netMoneyPerSecond: displayNum(player.netMoneyPerSecond, true), 
											proofs: displayNum(player.proofs, false), proofsPerSecond: displayNum(player.proofsPerSecond, false), moneyPerClick: displayNum(player.moneyPerClick * player.clickPower, true), 
											tickLength: parseFloat(player.updateInterval * player.timeMult).toFixed(0), timeMult: displayNum(player.timeMult, true), moneyPerAutoclick: displayNum(player.moneyPerAutoclick, true)});

	$("#info").html(newMoneyTable);
}

function updateInventory() {
	var firstRows = inventoryTemplate({deriv1Owned: displayNum(player.buildings[0].owned, false), deriv1Cost: displayNum(player.buildings[0].moneyCost, true), deriv1Manual: displayNum(player.buildings[0].manual, false), deriv1Power: displayNum(0.05 * player.mult[0] * globalMult[0], true),
										deriv2Owned: displayNum(player.buildings[5].owned, false), deriv2Cost: displayNum(player.buildings[5].moneyCost, true), deriv2Manual: displayNum(player.buildings[5].manual, false), deriv2Power: displayNum(Math.round(player.mult[1] * globalMult[1]), false),
										deriv3Owned: displayNum(player.buildings[10].owned, false), deriv3Cost: displayNum(player.buildings[10].moneyCost, true), deriv3Manual: displayNum(player.buildings[10].manual, false), deriv3Power: displayNum(Math.round(player.mult[2] * globalMult[2]), false),
										deriv4Owned: displayNum(player.buildings[15].owned, false), deriv4MoneyCost: displayNum(player.buildings[15].moneyCost, true), deriv4WidgetCost: displayNum(player.buildings[15].proofCost, false), deriv4Manual: displayNum(player.buildings[15].manual, false), deriv4Power: displayNum(Math.round(player.mult[3] * globalMult[3]), false),
										combinatoricsOwned: displayNum(player.buildings[1].owned, false), combinatoricsCost: displayNum(player.buildings[1].moneyCost, true), combinatoricsManual: displayNum(player.buildings[1].manual, false), combinatoricsPower: displayNum(Math.round(player.mult[0] * globalMult[0]), false),
										probabilityOwned: displayNum(player.buildings[6].owned, false), probabilityCost: displayNum(player.buildings[6].moneyCost, true), probabilityManual: displayNum(player.buildings[6].manual, false), probabilityPower: displayNum(Math.round(player.mult[1] * globalMult[1]), false),
										numberTheoryOwned: displayNum(player.buildings[11].owned, false), numberTheoryCost: displayNum(player.buildings[11].moneyCost, true), numberTheoryManual: displayNum(player.buildings[11].manual, false), numberTheoryPower: displayNum(Math.round(player.mult[2] * globalMult[2]), false),
										calculusOwned: displayNum(player.buildings[16].owned, false), calculusCost: displayNum(player.buildings[16].moneyCost, true), calculusManual: displayNum(player.buildings[16].manual, false), calculusPower: displayNum(Math.round(player.mult[3] * globalMult[3]), false),
										computerOwned: displayNum(player.buildings[2].owned, false), computerCost: displayNum(player.buildings[2].proofCost, false), computerManual: displayNum(player.buildings[2].manual, false), computerPower: displayNum(2 * player.mult[0] * globalMult[0], true), 
										assemblyLineOwned: displayNum(player.buildings[7].owned, false), assemblyLineCost: displayNum(player.buildings[7].proofCost, false), assemblyLineManual: displayNum(player.buildings[7].manual, false), assemblyLinePower: displayNum(Math.round(3 * player.mult[1] * globalMult[1]), false),
										factoryOwned: displayNum(player.buildings[12].owned, false), factoryCost: displayNum(player.buildings[12].proofCost, false), factoryManual: displayNum(player.buildings[12].manual, false), factoryPower: displayNum(Math.round(3 * player.mult[2] * globalMult[2]), false),
										factoryArchitectOwned: displayNum(player.buildings[17].owned, false), factoryArchitectCost: displayNum(player.buildings[17].proofCost, false), factoryArchitectManual: displayNum(player.buildings[17].manual, false), factoryArchitectPower: displayNum(Math.round(3 * player.mult[3] * globalMult[3]), false),
										highSchoolerOwned: displayNum(player.buildings[3].owned, false), highSchoolerCost: displayNum(player.buildings[3].moneyCost, true), highSchoolerManual: displayNum(player.buildings[3].manual, false), highSchoolerPower: displayNum(0.1 * player.mult[0] * globalMult[0], true),
										undergraduateOwned: displayNum(player.buildings[8].owned, false), undergraduateCost: displayNum(player.buildings[8].moneyCost, true), undergraduateManual: displayNum(player.buildings[8].manual, false), undergraduatePower: displayNum(Math.round(player.mult[1] * globalMult[1]), false),
										graduateStudentOwned: displayNum(player.buildings[13].owned, false), graduateStudentCost: displayNum(player.buildings[13].moneyCost, true), graduateStudentManual: displayNum(player.buildings[13].manual, false), graduateStudentPower: displayNum(Math.round(player.mult[2] * globalMult[2]), false),
										postdocOwned: displayNum(player.buildings[18].owned, false), postdocCost: displayNum(player.buildings[18].moneyCost, true), postdocManual: displayNum(player.buildings[18].manual, false), postdocPower: displayNum(Math.round(player.mult[3] * globalMult[3]), false),
										mathematicianOwned: displayNum(player.buildings[4].owned, false), mathematicianCost: displayNum(player.buildings[4].moneyCost, true), mathematicianManual: displayNum(player.buildings[4].manual, false),
										andrewWilesOwned: displayNum(player.buildings[9].owned, false), andrewWilesCost: displayNum(player.buildings[9].moneyCost, true), andrewWilesManual: displayNum(player.buildings[9].manual, false), andrewWilesPower: displayNum(Math.round(player.mult[1] * globalMult[1]), false),
										kurtGodelOwned: displayNum(player.buildings[14].owned, false), kurtGodelCost: displayNum(player.buildings[14].moneyCost, true), kurtGodelManual: displayNum(player.buildings[14].manual, false), kurtGodelPower: displayNum(Math.round(player.mult[2] * globalMult[2]), false),
										georgRiemannOwned: displayNum(player.buildings[19].owned, false), georgRiemannCost: displayNum(player.buildings[19].moneyCost, true), georgRiemannManual: displayNum(player.buildings[19].manual, false), georgRiemannPower: displayNum(Math.round(player.mult[3] * globalMult[3]), false),
										clicksToGain: player.clicksToGain, buildingPeriod: player.buildingInterval});
	
	var row5 = row5Template({deriv5Owned: displayNum(player.buildings[20].owned, false), deriv5MoneyCost: displayNum(player.buildings[20].moneyCost, true), deriv5ProofCost: displayNum(player.buildings[20].proofCost, true), deriv5Manual: displayNum(player.buildings[20].manual, false), deriv5Power: displayNum(Math.round(player.mult[4] * globalMult[4]), false),
										algebraOwned: displayNum(player.buildings[21].owned, false), algebraCost: displayNum(player.buildings[21].moneyCost, true), algebraManual: displayNum(player.buildings[21].manual, false), algebraPower: displayNum(Math.round(player.mult[4] * globalMult[4]), false),
										designSchoolOwned: displayNum(player.buildings[22].owned, false), designSchoolCost: displayNum(player.buildings[22].proofCost, true), designSchoolManual: displayNum(player.buildings[22].manual, false), designSchoolPower: displayNum(Math.round(3 * player.mult[4] * globalMult[4]), false),
										researchScientistOwned: displayNum(player.buildings[23].owned, false), researchScientistCost: displayNum(player.buildings[23].moneyCost, true), researchScientistManual: displayNum(player.buildings[23].manual, false), researchScientistPower: displayNum(Math.round(player.mult[4] * globalMult[4]), false),
										carlGaussOwned: displayNum(player.buildings[24].owned, false), carlGaussCost: displayNum(player.buildings[24].moneyCost, true), carlGaussManual: displayNum(player.buildings[24].manual, false), carlGaussPower: displayNum(Math.round(player.mult[4] * globalMult[4]), false),
										clicksToGain: player.clicksToGain, buildingPeriod: player.buildingInterval});
										
	var row6 = row6Template({deriv6Owned: displayNum(player.buildings[25].owned, false), deriv6MoneyCost: displayNum(player.buildings[25].moneyCost, true), deriv6ProofCost: displayNum(player.buildings[25].proofCost, true), deriv6Manual: displayNum(player.buildings[25].manual, false), deriv6Power: displayNum(Math.round(player.mult[5] * globalMult[5]), false),
										geometryOwned: displayNum(player.buildings[26].owned, false), geometryCost: displayNum(player.buildings[26].moneyCost, true), geometryManual: displayNum(player.buildings[26].manual, false), geometryPower: displayNum(Math.round(player.mult[5] * globalMult[5]), false),
										deanArchitectureOwned: displayNum(player.buildings[27].owned, false), deanArchitectureCost: displayNum(player.buildings[27].proofCost, true), deanArchitectureManual: displayNum(player.buildings[27].manual, false), deanArchitecturePower: displayNum(Math.round(3 * player.mult[5] * globalMult[5]), false),
										labManagerOwned: displayNum(player.buildings[28].owned, false), labManagerCost: displayNum(player.buildings[28].moneyCost, true), labManagerManual: displayNum(player.buildings[28].manual, false), labManagerPower: displayNum(Math.round(player.mult[5] * globalMult[5]), false),
										leonhardEulerOwned: displayNum(player.buildings[29].owned, false), leonhardEulerCost: displayNum(player.buildings[29].moneyCost, true), leonhardEulerManual: displayNum(player.buildings[29].manual, false), leonhardEulerPower: displayNum(Math.round(player.mult[5] * globalMult[5]), false),
										clicksToGain: player.clicksToGain, buildingPeriod: player.buildingInterval});
										
	var row7 = row7Template({deriv7Owned: displayNum(player.buildings[30].owned, false), deriv7MoneyCost: displayNum(player.buildings[30].moneyCost, true), deriv7ProofCost: displayNum(player.buildings[30].proofCost, true), deriv7Manual: displayNum(player.buildings[30].manual, false), deriv7Power: displayNum(Math.round(player.mult[6] * globalMult[6]), false),
										arithmeticOwned: displayNum(player.buildings[31].owned, false), arithmeticCost: displayNum(player.buildings[31].moneyCost, true), arithmeticManual: displayNum(player.buildings[31].manual, false), arithmeticPower: displayNum(Math.round(player.mult[6] * globalMult[6]), false),
										chancellorOwned: displayNum(player.buildings[32].owned, false), chancellorCost: displayNum(player.buildings[32].proofCost, true), chancellorManual: displayNum(player.buildings[32].manual, false), chancellorPower: displayNum(Math.round(3 * player.mult[6] * globalMult[6]), false),
										researchLabOwned: displayNum(player.buildings[33].owned, false), researchLabCost: displayNum(player.buildings[33].moneyCost, true), researchLabManual: displayNum(player.buildings[33].manual, false), researchLabPower: displayNum(Math.round(player.mult[6] * globalMult[6]), false),
										isaacNewtonOwned: displayNum(player.buildings[34].owned, false), isaacNewtonCost: displayNum(player.buildings[34].moneyCost, true), isaacNewtonManual: displayNum(player.buildings[34].manual, false), isaacNewtonPower: displayNum(Math.round(player.mult[6] * globalMult[6]), false),
										clicksToGain: player.clicksToGain, buildingPeriod: player.buildingInterval});
	
	$("#firstRows").html(firstRows);
	if(ifUnlockedTier(5)) $("#row5").html(row5);
	else $("#row5").html(null);
	if(ifUnlockedTier(6)) $("#row6").html(row6);
	else $("#row6").html(null);
	if(ifUnlockedTier(7)) $("#row7").html(row7);
	else $("#row7").html(null);
	
	//updates whether buttons are lit using a list of buttons	
	var buttonList = jQuery.makeArray($("#tableContainer div table tr .button"));
	
	if(player.numToBuy == "Max"){
		for(var i = 0; i < buttonList.length; i++){
			if(player.money < player.buildings[i].moneyCost || player.proofs < player.buildings[i].proofCost){
				buttonList[i].className = "button";
			}
			else{
				buttonList[i].className = "buttonLit";
			}
		}
	}
	else{
		for(var i = 0; i < buttonList.length; i++){
			var moneyCost = calcTotalPrice(player.buildings[i].moneyCost, player.buildings[i].factor, player.numToBuy);
			var proofCost = calcTotalPrice(player.buildings[i].proofCost, player.buildings[i].factor, player.numToBuy);
			if(player.money < moneyCost || player.proofs < proofCost){
				buttonList[i].className = "button";
			}
			else{
				buttonList[i].className = "buttonLit";
			}
		}
	}
}

function updateStats(){
	var newStats = statsTemplate({totalMoneyEarned: displayNum(player.totalMoneyEarned, true), totalProofs: displayNum(player.totalProofs, false),
								totalClicks: displayNum(player.totalClicks, false), totalManualClicks: displayNum(player.totalManualClicks, false), 
								totalTicks: displayNum(player.totalTicks, false), timeMult: displayNum(player.timeMult, false),
								totalCurrByProof: displayNum(player.proofsToCurrTracker,false),
								totalCurrByMaths: displayNum(player.mathematiciansToNextCurrTracker,false),
								totalResetCurr: displayNum(player.mathematiciansToNextCurrTracker + player.proofsToCurrTracker,false)
								});
  
	$("#statContainer").html(newStats);
}

function updateAchievements(){
	var cheevList = jQuery.makeArray($("#achievementContainer .achievement"));
	var cheevIndex = 0;
	var changed = false;
	for(var i = 0; i < player.achievements.length; i++){
		var achievement = player.achievements[i];
		checkAchievement(i);
		if(achievement.achieved){
			if(typeof(cheevList[cheevIndex]) == 'undefined' || achievement.name != cheevList[cheevIndex].innerHTML){
				var element = document.createElement("div");
				element.setAttribute("class", "achievement");
				var tooltip = achievement.text + "<br />Earned at " + achievement.time.toLocaleTimeString() + " " + achievement.time.toLocaleDateString();
				$(element).tooltipster({content: tooltip, theme: 'tooltipster-noir', contentAsHTML: true, delay: 0, speed: 200});
				element.innerHTML = achievement.name;
				cheevList.splice(cheevIndex, 0, element);
				changed = true;
			}
			cheevIndex++;
		}
	}
	if(changed){
		for(var i = 0; i < cheevList.length; i++){
			document.getElementById("achievementContainer").appendChild(cheevList[i]);
		}
	}
	
	$("#numAchievementsEarned").html(cheevList.length);
	$("#numAchievementsTotal").html(player.achievements.length);
}

function updatePrestige(){
	var newPrestige = prestigeTemplate({tier1Resets: player.numResets[0], tier1ResetCurr: displayNum(player.resetCurr[0], false), tier1GlobalMult: displayNum(globalMult[0], false), tier1CurrTracker: displayNum(player.resetCurrTracker, false),
										tier2Resets: player.numResets[1], tier2ResetCurr: displayNum(player.resetCurr[1], false), tier2GlobalMult: displayNum(globalMult[1], false), tier2CurrTracker: displayNum(Math.floor(player.resetCurr[0] / player.resetCurrFactor), false),
										tier3Resets: player.numResets[2], tier3ResetCurr: displayNum(player.resetCurr[2], false), tier3GlobalMult: displayNum(globalMult[2], false), tier3CurrTracker: displayNum(Math.floor(player.resetCurr[1] / player.resetCurrFactor), false),
										tier4Resets: player.numResets[3], tier4ResetCurr: displayNum(player.resetCurr[3], false), tier4GlobalMult: displayNum(globalMult[3], false), tier4CurrTracker: displayNum(Math.floor(player.resetCurr[2] / player.resetCurrFactor), false),
										tier5Resets: player.numResets[4], tier5ResetCurr: displayNum(player.resetCurr[4], false), tier5GlobalMult: displayNum(globalMult[4], false), tier5CurrTracker: displayNum(Math.floor(player.resetCurr[3] / player.resetCurrFactor), false),
										tier6Resets: player.numResets[5], tier6ResetCurr: displayNum(player.resetCurr[5], false), tier6GlobalMult: displayNum(globalMult[5], false), tier6CurrTracker: displayNum(Math.floor(player.resetCurr[4] / player.resetCurrFactor), false),
										proofsToNextCurr: displayNum(player.proofsToNextCurr, false), mathematiciansToNextCurr: displayNum(player.mathematiciansToNextCurr, false),
										proofsToNextCurrMax: displayNum(10 * Math.pow(10 * (10 + player.proofsToCurrTracker), 6), false), mathematiciansToNextCurrMax: displayNum(7000 * Math.pow(10 + player.mathematiciansToNextCurrTracker, 6), false),
										proofsPerTick: displayNum(player.proofsPerSecond, false), proofCurrPerTick: displayNum(Math.round(player.proofCurrPerTick), false), 
										mathematiciansPerPeriod: displayNum(Math.round(player.mult[1] * globalMult[1] * player.buildings[9].owned), false),
										mathematicianCurrPerTick: displayNum(Math.round(player.mathematicianCurrPerTick), false),
										buildingPeriod: player.buildingInterval});
	$("#prestige").html(newPrestige);
	
	if(typeof updatePrestige.mathThreshold === 'undefined'){ //hysteresis
		updatePrestige.mathThreshold = 2;
	}
	if(typeof updatePrestige.proofThreshold === 'undefined'){
		updatePrestige.proofThreshold = 2;
	}
	
	if(player.proofCurrPerTick >= updatePrestige.mathThreshold){
		$("#proofsToCurr").hide();
		$("#proofCurrPerTick").show();
		updatePrestige.mathThreshold = 1;
	} else{
		$("#proofsToCurr").show();
		$("#proofCurrPerTick").hide();
		updatePrestige.mathThreshold = 2;
	}
	
	if(player.mathematicianCurrPerTick >= updatePrestige.proofThreshold){
		$("#mathematiciansToCurr").hide();
		$("#mathematicianCurrPerTick").show();
		updatePrestige.proofThreshold = 1;
	} else{
		$("#mathematiciansToCurr").show();
		$("#mathematicianCurrPerTick").hide();
		updatePrestige.proofThreshold = 2;
	}
}

function updateResetCurrBuyables(){
	var $resetCurrTable = $("#resetCurrTable tr td .button, #resetCurrTable tr td .buttonLit")
    var buttonListProto = jQuery.makeArray($resetCurrTable);
    var buttonList = new Array(buttonListProto.length);
    for(i = 0; i < buttonListProto.length; i++){ //reorder elements to be in data order instead of DOM order
        buttonList[(i%4)*6 + Math.floor(i/4)] = buttonListProto[i];
    }
    
    for(var i = 0; i < buttonList.length; i++){
    	var altIndex = (i%6)*4 + Math.floor(i/6);
        if (player.currBuyables[i].owned){
            buttonList[i].innerHTML = "X";
            buttonList[i].className = "button";
            $resetCurrTable.eq(altIndex).tooltipster('content', updateResetCurrBuyables.originalTitles[i] + "<div class='strong'>Owned</div>");
            continue;
        }
        else {
        	buttonList[i].innerHTML = updateResetCurrBuyables.originalHtmlContents[i];
        	$resetCurrTable.eq(altIndex).tooltipster('content', updateResetCurrBuyables.originalTitles[i]);
        }
        if (i % 6 != 0){
            if(!player.currBuyables[i - 1].owned){
                $resetCurrTable.eq(altIndex).tooltipster('content', updateResetCurrBuyables.originalTitles[i] + "<div class='strong'>Not unlocked</div>");
                continue;
            }
            else $resetCurrTable.eq(altIndex).tooltipster('content', updateResetCurrBuyables.originalTitles[i]);
        }
        var afford = true;
        for (var j = 0; j < numTiers - 1; j++){
            if (player.resetCurr[j] < player.currBuyables[i].cost[j]){
                afford = false;
                buttonList[i].className = "button";
                break;
            }
        }
        if(!afford) continue;
        buttonList[i].className = "buttonLit";
    }
}

function updateResetCurrBuyablesTitles(){
	updateResetCurrBuyables.originalTitles[0] = "Unlocks tier 5.<br /> Costs " + displayNum(10, false) + " tier 1 reset currency.";
	updateResetCurrBuyables.originalTitles[1] = "Unlocks tier 6.<br /> Costs " + displayNum(50, false) + " tier 2 reset currency.";
	updateResetCurrBuyables.originalTitles[2] = "Unlocks tier 7.<br /> Costs " + displayNum(100, false) + " tier 3 reset currency.";
	updateResetCurrBuyables.originalTitles[3] = "Divides multiplying factor for buying buildings (past 1) by 1.1.<br /> Costs " + displayNum(100, false) + " tier 4 reset currency.";
	updateResetCurrBuyables.originalTitles[4] = "Divides multiplying factor for buying buildings (past 1) by 1.1.<br /> Costs " + displayNum(100, false) + " tier 5 reset currency.";
	updateResetCurrBuyables.originalTitles[5] = "Divides multiplying factor for buying buildings (past 1) by 1.1.<br /> Costs " + displayNum(100, false) + " tier 6 reset currency.";
	updateResetCurrBuyables.originalTitles[6] = "Reduces clicks for new clicker buildings by 5.<br /> Costs " + displayNum(1000, false) + " tier 1 reset currency.";
	updateResetCurrBuyables.originalTitles[7] = "Reduces clicks for new clicker buildings by 5.<br /> Costs " + displayNum(1000, false) + " tier 2 reset currency.";
	updateResetCurrBuyables.originalTitles[8] = "Reduces clicks for new clicker buildings by 4.<br /> Costs " + displayNum(2000, false) + " tier 3 reset currency.";
	updateResetCurrBuyables.originalTitles[9] = "Reduces clicks for new clicker buildings by 3.<br /> Costs " + displayNum(5000, false) + " tier 4 reset currency.";
	updateResetCurrBuyables.originalTitles[10] = "Reduces clicks for new clicker buildings by 2.<br /> Costs " + displayNum(10000, false) + " tier 5 reset currency.";
	updateResetCurrBuyables.originalTitles[11] = "Reduces clicks for new clicker buildings by 2.<br /> Costs " + displayNum(20000, false) + " tier 6 reset currency.";
	updateResetCurrBuyables.originalTitles[12] = "Reduces ticks for new buildings by 1.<br /> Costs " + displayNum(100000, false) + " tier 1 reset currency.";
	updateResetCurrBuyables.originalTitles[13] = "Reduces ticks for new buildings by 1.<br /> Costs " + displayNum(100000, false) + " tier 2 reset currency.";
	updateResetCurrBuyables.originalTitles[14] = "Reduces ticks for new buildings by 1.<br /> Costs " + displayNum(200000, false) + " tier 3 reset currency.";
	updateResetCurrBuyables.originalTitles[15] = "Reduces ticks for new buildings by 1.<br /> Costs " + displayNum(200000, false) + " tier 4 reset currency.";
	updateResetCurrBuyables.originalTitles[16] = "Reduces ticks for new buildings by 1.<br /> Costs " + displayNum(500000, false) + " tier 5 reset currency.";
	updateResetCurrBuyables.originalTitles[17] = "Reduces ticks for new buildings by 1.<br /> Costs " + displayNum(500000, false) + " tier 6 reset currency.";
	updateResetCurrBuyables.originalTitles[18] = "Reduces ticks between autoclicks by 10.<br /> Costs " + displayNum(10000000, false) + " tier 1 reset currency.";
	updateResetCurrBuyables.originalTitles[19] = "Reduces ticks between autoclicks by 10.<br /> Costs " + displayNum(10000000, false) + " tier 2 reset currency.";
	updateResetCurrBuyables.originalTitles[20] = "Reduces ticks between autoclicks by 10.<br /> Costs " + displayNum(20000000, false) + " tier 3 reset currency.";
	updateResetCurrBuyables.originalTitles[21] = "Reduces reset currency conversion factor by 1.<br /> Costs " + displayNum(1000000000, false) + " tier 4 reset currency.";
	updateResetCurrBuyables.originalTitles[22] = "Reduces reset currency conversion factor by 1.<br /> Costs " + displayNum(2000000000, false) + " tier 5 reset currency.";
	updateResetCurrBuyables.originalTitles[23] = "Reduces reset currency conversion factor by 1.<br /> Costs " + displayNum(5000000000, false) + " tier 6 reset currency.";
}

function ifUnlockedTier(tier){
	return player.currBuyables[tier - 5].owned;
}

function updateUpgrades(){
	var newUpgrades = upgradesTemplate({tier1UpgradeCost: displayNum(player.tierUpgradeCosts[0], true), tier1UpgradeOwned: displayNum(player.tierUpgrades[0], false), tier1Mult: displayNum(player.mult[0], false),
										tier2UpgradeCost: displayNum(player.tierUpgradeCosts[1], true), tier2UpgradeOwned: displayNum(player.tierUpgrades[1], false), tier2Mult: displayNum(player.mult[1], false),
										tier3UpgradeCost: displayNum(player.tierUpgradeCosts[2], true), tier3UpgradeOwned: displayNum(player.tierUpgrades[2], false), tier3Mult: displayNum(player.mult[2], false),
										tier4UpgradeCost: displayNum(player.tierUpgradeCosts[3], true), tier4UpgradeOwned: displayNum(player.tierUpgrades[3], false), tier4Mult: displayNum(player.mult[3], false),
										tier5UpgradeCost: displayNum(player.tierUpgradeCosts[4], true), tier5UpgradeOwned: displayNum(player.tierUpgrades[4], false), tier5Mult: displayNum(player.mult[4], false),
										tier6UpgradeCost: displayNum(player.tierUpgradeCosts[5], true), tier6UpgradeOwned: displayNum(player.tierUpgrades[5], false), tier6Mult: displayNum(player.mult[5], false),
										tier7UpgradeCost: displayNum(player.tierUpgradeCosts[6], true), tier7UpgradeOwned: displayNum(player.tierUpgrades[6], false), tier7Mult: displayNum(player.mult[6], false),
										autoclickerCost: displayNum(player.upgradeCosts[0], true), autoclickerOwned: displayNum(player.upgrades[0], false), autoclickInterval: player.autoclickInterval,
										manualClickBoosterCost: displayNum(player.upgradeCosts[1], true), manualClickBoosterOwned: displayNum(player.upgrades[1], false), clickPower: displayNum(player.clickPower, false)});
	
	$("#upgrades").html(newUpgrades);
	
	//hides rows if upgrades aren't unlocked
	if(!ifUnlockedTier(5)) $("#tier5UpgradeRow").css('display', 'none');
	else $("#tier5UpgradeRow").css('display', 'table-row');
	if(!ifUnlockedTier(6)) $("#tier6UpgradeRow").css('display', 'none');
	else $("#tier6UpgradeRow").css('display', 'table-row');
	if(!ifUnlockedTier(7)) $("#tier7UpgradeRow").css('display', 'none');
	else $("#tier7UpgradeRow").css('display', 'table-row');
	
	buttonList = jQuery.makeArray($("#upgradesTable tr .button"));
	
	if(player.numToBuy == "Max"){
    	for(var i = 0; i < numTiers; i++){
    		if(player.money < player.tierUpgradeCosts[i]){
    			buttonList[i].className = "button";
    		}
    		else{
    			buttonList[i].className = "buttonLit";
    		}
    	}
    	for(var i = 0; i < 2; i++){
    		if(player.money < player.upgradeCosts[i]){
    			buttonList[i + numTiers].className = "button";
    		}
    		else{
    			buttonList[i + numTiers].className = "buttonLit";
    		}
    	}
    }
    else{
        for(var i = 0; i < numTiers; i++){
            var cost = calcTotalPrice(player.tierUpgradeCosts[i], 1000, player.numToBuy);
            if(player.money < cost){
                buttonList[i].className = "button";
            }
            else{
                buttonList[i].className = "buttonLit";
            }
        }
        for(var i = 0; i < 2; i++){
            var cost = calcTotalPrice(player.upgradeCosts[i], upgradeCostFactor[i], player.numToBuy);
            if(player.money < cost){
                buttonList[i + numTiers].className = "button";
            }
            else{
                buttonList[i + numTiers].className = "buttonLit";
            }
        }
    }
}

function updateInfini(){
	var newInfini = infiniTemplate({infiniCurr: displayNum(player.infiniCurr, false)});
	
	$("#infini").html(newInfini);
	
	if(player.infiniResetDone && $("#infiniTab").length == 0){
		var tabs = $( "#tabs" ).tabs();
		var ul = tabs.find( "ul" );
		$( "<li onclick='updateInfini();' id='infiniTab'><a href='#infini'>Infini</a></li>" ).appendTo( ul );
		$( "<div id='infini'></div>" ).appendTo( tabs );
		tabs.tabs( "refresh" );
	} else if(!player.infiniResetDone) {
		$("#infiniTab").remove();
		$("#infini").remove();
		$("#tabs").tabs("refresh");
	}
	
}

function updateAll(){
    updateMoney();
    updateInventory();
    updateUpgrades();
    updateStats();
    updateAchievements();
    updatePrestige();
    updateResetCurrBuyables();
    updateInfini();
}

//this is a function to click the money button: allows auto button clicking
function moneyButtonClick(amount) {
	var ifUpdate = false;
	addMoney(player.moneyPerClick * amount);
	player.clickTracker += amount;
	player.totalClicks += amount;
	if(player.clickTracker < 5000 * player.clicksToGain){ //while loop gets executed max 5000 times
    	while(player.clickTracker >= player.clicksToGain){
    		var toAdd = Math.round(player.buildings[8].owned * player.mult[1] * globalMult[1])
    		player.clickTracker -= player.clicksToGain;
    		addMoneyPerClick(0.1 * player.mult[0] * toAdd * globalMult[0]);
    		for(var i = 0; i < numTiers - 1; i++){
    			player.buildings[5*i + 3].owned += Math.round(player.buildings[5*(i+1) + 3].owned*player.mult[i+1]*globalMult[i+1]);
    		}
    	}
    	ifUpdate = true;
    }
    else{ //removes iterative component for large numbers
        var toAdd = Math.round(player.buildings[8].owned * player.mult[1] * globalMult[1] * Math.floor(amount / player.clicksToGain));
        player.clickTracker = amount % player.clicksToGain;
        addMoneyPerClick(0.1 * player.mult[0] * toAdd * globalMult[0]);
        for(var i = 0; i < numTiers - 1; i++){
            player.buildings[5*i + 3].owned += Math.round(player.buildings[5*(i+1) + 3].owned*player.mult[i+1]*globalMult[i+1] * Math.floor(amount / player.clicksToGain));
        }
        ifUpdate = true;
    }
        
	player.moneyPerAutoclick = player.upgrades[0] * player.moneyPerClick;
	updateMoney();
	if(ifUpdate) updateInventory();
}

function versionControl(ifImport){
	//resets if the current version is incompatible with the savefile
	if(player.versionNum < 0.22){
		if(ifImport){
			alert("This save is incompatible with the current version.");
			return;
		}
		alert("Your save has been wiped as part of an update. Sorry for the inconvenience.\nWipe goes with: version " + 0.22);
		init();
		localStorage.setItem("playerStored", JSON.stringify(player));
		return;
	}
	if(player.versionNum < 0.3){
		player.clicksToGain = 25;
		player.upgrades[1] = 0;
		player.upgradeCosts[1] = 10000000;
	}
	if(player.versionNum < 0.32){
		var set = false;
		if(player.currBuyables[11].owned){
			player.clicksToGain = 4;
			set = true;
		}
		if(player.currBuyables[10].owned && !set){
			player.clicksToGain = 6;
			set = true;
		}
		if(player.currBuyables[9].owned && !set){
			player.clicksToGain = 8;
			set = true;
		}
		if(player.currBuyables[8].owned && !set){
			player.clicksToGain = 11;
			set = true;
		}
		if(player.currBuyables[7].owned && !set){
			player.clicksToGain = 15;
			set = true;
		}
		if(player.currBuyables[6].owned && !set){
			player.clicksToGain = 20;
			set = true;
		}
		if(!set){
			player.clicksToGain = 25;
		}
	}
	if(player.versionNum < 0.33){
		if(isNaN(player.upgradeCosts[1])) player.upgradeCosts[1] = 10000000 * Math.pow(100, 24);
	}
	if(player.versionNum == 0.34){
		player.proofsToNextCurr = 10000000000000;
		player.proofsToCurrTracker = 0;
		player.mathematiciansToNextCurr = 7000000000;
		player.mathematiciansToNextCurrTracker = 0;
		player.totalMoneyEarned = 0;
		player.totalProofs = 0;
		player.totalClicks = 0;
		player.totalManualClicks = 0;
		player.totalTicks = 0;
	}
	if(player.versionNum < versionNum || typeof player.versionNum == 'undefined'){
		player.versionNum = versionNum;
	}
}

//things that run on startup: moneybutton initialization, tabs, initial DOM updates, load save
$(document).ready(function(){
	$("#tabs").tabs({show:{effect: "slideDown"}}, {hide:{effect: "slideUp"}});
  
	if(localStorage.getItem("playerStored") != null) load();
	if(typeof enableChart == 'undefined') enableChart = true;
	if(!enableChart) $("#chartStuff").toggle();
	
	versionControl(false);
	
	fixJSON();

	$("#version").html(player.versionNum);

	$("#currentNumToBuy").html(player.numToBuy);
	$("#currentNumToBuy2").html(player.numToBuy);
	$("#minTickLength").html(player.minTickLength);
	
	//stores original titles of buttons
	var $resetCurrTable = $("#resetCurrTable tr td .button, #resetCurrTable tr td .buttonLit");
	var buttonListProto = jQuery.makeArray($resetCurrTable);
    updateResetCurrBuyables.originalHtmlContents = new Array(buttonListProto.length);
    for(var i = 0; i < buttonListProto.length; i++){
    	updateResetCurrBuyables.originalHtmlContents[i] = buttonListProto[(i%6)*4 + Math.floor(i/6)].innerHTML;
    }
    updateResetCurrBuyables.originalTitles = new Array(24);
	updateResetCurrBuyablesTitles();
	
	$("#resetCurrTable tr td .buttonLit, #resetCurrTable tr td .button").tooltipster({theme: 'tooltipster-noir', contentAsHTML: true, delay: 0, speed: 200});

	for(i = 1; i <= numTiers; i++){
		calcMult(i);
	}
	calcGlobalMult();
	
    updateAll();
  
	$("#moneyButton").click(function(){
		moneyButtonClick(player.clickPower);
		player.totalManualClicks += player.clickPower;
	});
});

//function to buy buildings: onclick events

function buyBuilding(index){
	var numToBuy, moneyCost, proofCost;
	if(player.numToBuy == "Max"){
		var numToBuy = 0;
		while(calcTotalPrice(player.buildings[index].moneyCost, player.buildings[index].factor, numToBuy) <= player.money && Math.round(calcTotalPrice(player.buildings[index].proofCost, player.buildings[index].factor, numToBuy)) <= player.proofs){
			numToBuy++;
		}
		numToBuy--;
	}
	else numToBuy = player.numToBuy;
	
	if(numToBuy <= 0) return;
	
	moneyCost = calcTotalPrice(player.buildings[index].moneyCost, player.buildings[index].factor, numToBuy);
	proofCost = Math.round(calcTotalPrice(player.buildings[index].proofCost, player.buildings[index].factor, numToBuy));
	
	if(player.money >= moneyCost && player.proofs >= proofCost){
		
		player.buildings[index].owned += numToBuy;
		player.buildings[index].manual += numToBuy;
			
		addMoney(-moneyCost);
		player.proofs -= proofCost;
			
		player.buildings[index].moneyCost = Math.round((player.buildings[index].moneyCost * Math.pow(player.buildings[index].factor, numToBuy))*100)/100;
		player.buildings[index].proofCost = Math.round(player.buildings[index].proofCost * Math.pow(player.buildings[index].factor, numToBuy));
		
		calcMult(Math.ceil(index/5.0 + 0.1)); //picks the right multiplier based on the index
		switch(index){
			case 0: //deriv1
				addMoneyPerSecond(player.deriv1Money * player.mult[0] * numToBuy * globalMult[0]);
				addNetMoneyPerSecond(player.deriv1Money * player.mult[0] * numToBuy * globalMult[0]);
				break;
			case 1: //combinatorics
				player.proofsPerSecond += 1 * player.mult[0] * numToBuy * globalMult[0];
				player.proofsPerSecond = Math.floor(player.proofsPerSecond);
				addNetMoneyPerSecond(-player.costPerProof * player.mult[0] * numToBuy * globalMult[0]);
				break;
			case 2: //computer
				addMoneyPerSecond(2 * player.mult[0] * numToBuy * globalMult[0]);
				addNetMoneyPerSecond(2 * player.mult[0] * numToBuy * globalMult[0]);
				break;
			case 3: //high schooler
				addMoneyPerClick(0.1 * player.mult[0] * numToBuy * globalMult[0]);
				break;
			case 4: //mathematician
				player.mathematiciansToNextCurr -= numToBuy;
			default:
				break;
		}
	}
	updateMoney();
	updateInventory();
}			
  
//function to buy upgrades: onclick events

function buyTierUpgrade(index){
    var numToBuy, cost;
    if(player.numToBuy == "Max"){
        var numToBuy = 0;
        while(calcTotalPrice(player.tierUpgradeCosts[index], 1000, numToBuy) <= player.money){
            numToBuy++;
        }
        numToBuy--;
    }
    else numToBuy = player.numToBuy;
    
    if(numToBuy <= 0) return;
    
    cost = calcTotalPrice(player.tierUpgradeCosts[index], 1000, numToBuy);
    
	if(player.money >= cost){
		player.tierUpgrades[index]+= numToBuy;

		addMoney(-cost);
		player.tierUpgradeCosts[index] = Math.round((player.tierUpgradeCosts[index] * Math.pow(1000, numToBuy))*100)/100;
		calcMult(index + 1);
		
		updateUpgrades();
		updateMoney();
	}
}

function buyUpgrade(index) {
	var numToBuy, cost;
	if (player.numToBuy == "Max") {
		var numToBuy = 0;
		while (calcTotalPrice(player.upgradeCosts[index], upgradeCostFactor[index], numToBuy) <= player.money) {
			numToBuy++;
		}
		numToBuy--;
	} else numToBuy = player.numToBuy;

	if (numToBuy <= 0) return;

	cost = calcTotalPrice(player.upgradeCosts[index], upgradeCostFactor[index], numToBuy);

	if (player.money >= cost) {
		player.upgrades[index] += numToBuy;

		addMoney(-cost);
		player.upgradeCosts[index] = Math.round((player.upgradeCosts[index] * Math.pow(upgradeCostFactor[index], numToBuy)) * 100) / 100;

		if (index == 1)	player.clickPower += numToBuy;

		updateUpgrades();
		updateMoney();
	}
}

function buyCurrBuyable(index) {
	//conditions for buyable
	if (player.currBuyables[index].owned) return; //already owned
	if (index % 6 != 0){
		if(!player.currBuyables[index - 1].owned) return; //lower tier one not owned
	}
	for (var i = 0; i < numTiers - 1; i++) if (player.resetCurr[i] < player.currBuyables[index].cost[i]) return; //not enough curr

	player.currBuyables[index].owned = true;
	for (var i = 0; i < numTiers - 1; i++) player.resetCurr[i] -= player.currBuyables[index].cost[i];
	calcGlobalMult();

	switch(index) {
		case 3:
		case 4:
		case 5:	//factor reducers
			for (var i = 0; i < player.buildings.length; i++){
				player.buildings[i].factor = 1 + (player.buildings[i].factor - 1) / 1.1;
			}
			break;
		case 6:	//click improvers
			player.clicksToGain = 20;
			break;
		case 7:
			player.clicksToGain = 15;
			break;
		case 8:
			player.clicksToGain = 11;
			break;
		case 9:
			player.clicksToGain = 8;
			break;
		case 10:
			player.clicksToGain = 6;
			break;
		case 11:
			player.clicksToGain = 4;
			break;
		case 12: //building tick reducers
		case 13:
		case 14:
		case 15:
		case 16:
		case 17:
			player.buildingInterval -= 1;
			break;
		case 18: //autoclick tick reducers
		case 19:
		case 20:
			player.autoclickInterval -= 10;
			break;
		case 21: //reset currency conversion factor
		case 22:
		case 23:
			player.resetCurrFactor -= 1;
			break;
		default:
			break;
	}
	
	updatePrestige();
	updateResetCurrBuyables();
}

var update = function(){
	// update.count makes stuff happen every 3 ticks
	if(typeof update.count == 'undefined'){
		update.count = 0;
	}
	// update.count2 makes stuff happen every minute
	if(typeof update.count2 == 'undefined'){
		update.count2 = 0;
	}
	//intervalTracker fixes window minimization issues
	if(typeof update.intervalTracker == 'undefined'){
		update.intervalTracker = 0;
	}
	if(typeof update.before == 'undefined'){
		update.before = new Date();
	}
	
	var now = new Date();
	var elapsedTime = now.getTime() - update.before.getTime();
	
	update.intervalTracker += isActive ? 0 : elapsedTime;
	
	do{
		//adds money
		addMoney(player.buildings[0].owned * player.deriv1Money * player.mult[0] * globalMult[0] * player.timeMult);
		addMoney(player.buildings[2].owned * 2 * player.mult[0] * globalMult[0] * player.timeMult);
		
		//checks if enough money to add full amount of proofs: if so, adds proofs, otherwise, adds as many proofs as possible
		if(player.money >= player.buildings[1].owned * player.costPerProof * player.mult[0] * globalMult[0] * player.timeMult){
			addProofs(player.buildings[1].owned * player.mult[0] * globalMult[0] * player.timeMult);
		}
		else addProofs(Math.floor(player.money / player.costPerProof));
		
		if(update.count >= player.buildingInterval){
			player.mathematicianCurrPerTick = 0;
		}
		player.proofCurrPerTick = 0;
		//does stuff every buildingInterval ticks
		if(update.count >= player.buildingInterval){
			inventoryAdder(Math.floor(update.count / player.buildingInterval));
			update.count = update.count % player.buildingInterval;
		}
	
		//does stuff every autoclickInterval ticks
		if(update.count2 >= player.autoclickInterval){
			moneyButtonClick(player.upgrades[0] * Math.floor(update.count2 / player.autoclickInterval));
			update.count2 = update.count2 % player.autoclickInterval;
		}
		
		//checks if enough proofs/mathematicians for reset currency: if so, adds reset currency
		if(player.proofsToNextCurr > -10000 * Math.pow(10 * (10 + player.proofsToCurrTracker), 6)){
			while(player.proofsToNextCurr < 0){
				player.resetCurrTracker++;
				player.proofCurrPerTick += 1 / player.timeMult;
				player.proofsToCurrTracker++;
				player.proofsToNextCurr += 10 * Math.pow(10 * (10 + player.proofsToCurrTracker), 6);
			}
		}
		else{
			var currToGain = Math.ceil(Math.pow(-player.proofsToNextCurr/(10000000/7) + Math.pow(10+player.proofsToCurrTracker, 7), 1/7)) - 10 - player.proofsToCurrTracker; //approximate reset curr gained without while loop
			if(-player.proofsToNextCurr > 1e106) currToGain += currToGain / 1e6; //deals with inaccuracy in numbering
			player.proofsToNextCurr += 10000000/7 * (Math.pow(10 + currToGain + player.proofsToCurrTracker, 7) - Math.pow(10 + player.proofsToCurrTracker - 1, 7));
			player.resetCurrTracker += currToGain;
			player.proofCurrPerTick += currToGain / player.timeMult;
			player.proofsToCurrTracker += currToGain;
		}
		
		if(player.mathematiciansToNextCurr > -7000000 * Math.pow(10 + player.mathematiciansToNextCurrTracker, 6)){
			while(player.mathematiciansToNextCurr < 0){
				player.resetCurrTracker++;
				player.mathematicianCurrPerTick += 1 / player.timeMult;
				player.mathematiciansToNextCurrTracker++;
				player.mathematiciansToNextCurr += 7000 * Math.pow(10 + player.mathematiciansToNextCurrTracker, 6)
			}
		}
		else{
			var currToGain = Math.ceil(Math.pow(-player.mathematiciansToNextCurr/1000 + Math.pow(10+player.mathematiciansToNextCurrTracker, 7), 1/7)) - 10 - player.mathematiciansToNextCurrTracker; //approximate reset curr gained without while loop
			player.mathematiciansToNextCurr += 1000 * (Math.pow(10 + currToGain + player.mathematiciansToNextCurrTracker, 7) - Math.pow(10 + player.mathematiciansToNextCurrTracker - 1, 7));
			player.resetCurrTracker += currToGain;
			player.mathematiciansToNextCurrTracker += currToGain;
			player.mathematicianCurrPerTick += currToGain / player.timeMult;
		}
		
		//recalculates money/proofs per tick
		player.moneyPerClick = ((player.buildings[3].owned * player.mult[0] * 0.1) + 1) * globalMult[0];
		player.moneyPerSecond = (((player.buildings[0].owned * player.deriv1Money * player.mult[0]) + (player.buildings[2].owned * 2 * player.mult[0])) * globalMult[0]);
		player.proofsPerSecond = Math.round(player.buildings[1].owned * player.mult[0] * globalMult[0]);
		player.netMoneyPerSecond = player.moneyPerSecond - (player.proofsPerSecond * player.costPerProof);
		player.moneyPerAutoclick = player.upgrades[0] * player.moneyPerClick;
		
		update.count += player.timeMult;
		update.count2 += player.timeMult;
		player.totalTicks += player.timeMult;
		
		player.updateInterval = 1000 * Math.pow(0.98, Math.log(player.buildings[4].owned * player.mult[0] * globalMult[0] + 1));
		
		//updateResetCurrBuyables fixes minimization by running until the interval tracker is less than 0 if the thing isn't active
		if(!isActive) update.intervalTracker -= player.updateInterval * player.timeMult;
		
	}while(!isActive && update.intervalTracker > 0 && elapsedTime > player.updateInterval);
	
	//deals with infini-resets
	if(!isFinite(player.money)){
		infiniReset();
	}
	
	
	//checks active tab, updates appropriate things
	var activeTab = $("#tabs").tabs("option", "active");
	switch(activeTab){
		case 0:
			updateInventory();
			break;
			
		case 1:
			updateUpgrades();
			break;
		
		case 2:
			updatePrestige();
			break;
		
		case 4:
			updateStats();
			updateAchievements();
			break;
	}
	updateMoney();
	
	update.before = new Date();
	
	while(player.updateInterval * player.timeMult < player.minTickLength) player.timeMult *= 1000 / player.minTickLength; //sets up time multiplier if game's ticking too fast
	
	setTimeout(update, player.updateInterval * player.timeMult);
}
//stuff that happens each tick
setTimeout(update, player.updateInterval * player.timeMult);

setInterval(save, 60000);

//stuff that happens every ten ticks (i.e. inventory additions)
function inventoryAdder(amount){
    if(amount < 250){
        while(amount > 0){
        	player.mathematiciansToNextCurr -= Math.round(player.buildings[9].owned * player.mult[1] * globalMult[1]);
        	
        	for(var i = 0; i < player.buildings.length - 5; i++){
        		switch(i % 5){
        			case 0:
        			case 1:
        			case 4:
        				player.buildings[i].owned += Math.round(player.buildings[i+5].owned * player.mult[Math.floor(i/5) + 1] * globalMult[Math.floor(i/5) + 1]);
        				break;
        			case 2:
        				player.buildings[i].owned += Math.round(3 * player.buildings[i+5].owned * player.mult[Math.floor(i/5) + 1] * globalMult[Math.floor(i/5) + 1]);
        				break;
        			default:
        				break;
        		}
        	}
        	amount--;
        }
    }
    else{
        player.mathematiciansToNextCurr -= Math.round(player.buildings[9].owned * player.mult[1] * globalMult[1] * amount);
        
        for(var i = 0; i < player.buildings.length - 5; i++){
            switch(i % 5){
                case 0:
                case 1:
                case 4:
                    player.buildings[i].owned += Math.round(player.buildings[i+5].owned * player.mult[Math.floor(i/5) + 1] * globalMult[Math.floor(i/5) + 1]) * amount;
                    break;
                case 2:
                    player.buildings[i].owned += Math.round(3 * player.buildings[i+5].owned * player.mult[Math.floor(i/5) + 1] * globalMult[Math.floor(i/5) + 1]) * amount;
                    break;
                default:
                    break;
                    
            }
        }
    }
}
