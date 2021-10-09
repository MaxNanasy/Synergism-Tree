addLayer("d", {
    name: "diamonds", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "D", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "#4BDC13",
    // TODO Implement actual diamond prestiging
    requires: Decimal.dInf, // Can be a function that takes requirement increases into account
    resource: "diamonds", // Name of prestige currency
    baseResource: "coins", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    // TODO Implement actual diamond prestiging
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "d", description: "D: Reset for diamonds", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    update(diff) {
        // player.best is updated here because update for the top-left layer
        // seems to be the earliest dev hook invoked after player.points is
        // updated in gameLoop
        player.best = player.best.max(player.points)
    },
    buyables: {
        11: coinBuildingBuyable({
            title: 'Workers',
            baseCost: 100,
            costExponent: 1,
            baseEffect: 10,
        }),
        12: coinBuildingBuyable({
            title: 'Investments',
            baseCost: 2e3,
            unlockAmount: 1000,
            costExponent: 2,
            baseEffect: 100,
        }),
        13: coinBuildingBuyable({
            title: 'Printers',
            baseCost: 4e4,
            unlockAmount: 20000,
            costExponent: 3,
            baseEffect: 1000,
        }),
        14: coinBuildingBuyable({
            title: 'Coin Mints',
            baseCost: 8e5,
            unlockAmount: 100000,
            costExponent: 4,
            baseEffect: 10000,
        }),
        15: coinBuildingBuyable({
            title: 'Alchemies',
            baseCost: 16e6,
            unlockAmount: 8e6,
            costExponent: 5,
            baseEffect: 100000,
        })
    }
})

function coinBuildingBuyable({
    title,
    baseCost,
    unlockAmount = 0,
    costExponent,
    baseEffect,
}) {
    return {
        // TODO The Synergism cost formula seems more complicated than this
        // TODO Is there any cost rounding in Synergism?
        cost(x) {
            let cost = new Decimal(baseCost)
            for (let i = 0; i < +x; i ++) {
                cost = cost.mul(Decimal.pow(1.25, costExponent))
                cost = cost.add(1)
            }
            return cost
        },
        effect(x) { return x.mul(baseEffect) },
        title,
        display() { // Everything else displayed in the buyable button after the title
            // TODO Include percentage of Coins/Sec
            return `Amount: ${getBuyableAmount(this.layer, this.id)}
                    Cost: ${format(tmp[this.layer].buyables[this.id].cost)}
                    Coins/Sec: ${format(buyableEffect(this.layer, this.id))}`
        },
        canAfford() { return player.points.gte(this.cost()) },
        buy() {
            player.points = player.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        unlocked() { return player.best.gte(unlockAmount) },
    }
}
