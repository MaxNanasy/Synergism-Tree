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
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
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
    buyables: {
        11: {
            // TODO Use real cost formula
            cost(x) { return new Decimal(100).mul(x.add(1)) },
            effect(x) { return x.mul(10) },
            title: "Workers",
            display() { // Everything else displayed in the buyable button after the title
                // TODO Include percentage of Coins/Sec
                return `Amount: ${format(getBuyableAmount(this.layer, this.id))}
                        Cost: ${format(tmp[this.layer].buyables[this.id].cost)}
                        Coins/Sec: ${format(buyableEffect(this.layer, this.id))}`
            },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }
        }
    }
})
