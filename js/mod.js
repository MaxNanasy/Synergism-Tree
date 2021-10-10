let modInfo = {
	name: "Synergism Tree",
	id: "synergism-tree",
	author: "Max Nanasy",
	pointsName: "coins",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (100),
	// TODO Match Synergism's offline time mechanics
	offlineLimit: 72, // In hours
}

let VERSION = {
	num: "0.0",
	name: "Literally nothing",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Initial version.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
	return new Decimal(modInfo.initialStartPoints)
}

function canGenPoints(){
	return true
}

function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	// TODO Handle taxes

	let gain = new Decimal(0)

	const buildingBuyableIds = [ 11, 12, 13, 14, 15 ]
	for (const buyableId of buildingBuyableIds)
		gain = gain.add(buyableEffect('d', buyableId))

	return gain
}

function addedPlayerData() { return {
	// The Modding Tree doesn't seem to track best player points OOTB
	best: getStartPoints()
}}

var displayThings = [
]

function isEndgame() {
	// TODO Implement Synergism's endgame condition, if any
	return false
}



// TODO Comment where constants and formulas come from in Synergism source code (or something)
	// Currently they're copied from revision 4adcb574497c7a627ee94cc858b1030bd38b962e (master branch) of https://github.com/Pseudo-Corp/SynergismOfficial

// TODO Is there any cost rounding in Synergism?



// Less important things beyond this point!

var backgroundStyle = {

}

function maxTickLength() {
	return 3600
}

function fixOldSave(oldVersion){
}
