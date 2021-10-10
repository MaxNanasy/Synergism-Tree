addLayer("d", {
    name: "diamonds",
    symbol: "D",
    row: 0,
    position: 0,
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "#4BDC13",
    // TODO Implement actual diamond prestiging
    requires: Decimal.dInf,
    resource: "diamonds",
    baseResource: "coins",
    baseAmount() {return player.points},
    // TODO Implement actual diamond prestiging
    type: "none",
    exponent: 0.5,
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
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
        }),

        21: coinBuyable({
            title: 'Accelerators',
            unlockAmount: 1000,

            // TODO The Synergism cost formula seems more complicated than this
            cost(x) {
                return Decimal.pow(4, x).mul(500)
            },

            effect(x) {
                // TODO https://github.com/Pseudo-Corp/SynergismOfficial/blob/4adcb574497c7a627ee94cc858b1030bd38b962e/src/Synergism.ts#L1719-L1721
                return this.accelerationPower().pow(x)
            },

            displayTrailer() {
                const accelerationPowerPercentIncrease = this.accelerationPower().mul(100).sub(100)

                const accelerationMultiplier = buyableEffect(this.layer, this.id)

                return `Acceleration Power: ${format(accelerationPowerPercentIncrease)}%
                        Acceleration Multiplier: ${format(accelerationMultiplier)}x`
            },

            accelerationPower() {
                // TODO Don't hardcode
                return new Decimal(1.1)
            },
        }),
    }
})

function coinBuildingBuyable({
    baseCost,
    costExponent,
    baseEffect,
    ...otherArgs
}) {
    return coinBuyable({
        // TODO The Synergism cost formula seems more complicated than this
        cost(x) {
            let cost = new Decimal(baseCost)
            for (let i = 0; i < +x; i ++) {
                cost = cost.mul(Decimal.pow(1.25, costExponent))
                cost = cost.add(1)
            }
            return cost
        },

        effect(x) {
            let effect = x.mul(baseEffect)

            const acceleratorsBuyableId = 21
            const accelerationMultiplier = buyableEffect(this.layer, acceleratorsBuyableId)
            effect = effect.mul(accelerationMultiplier)

            return effect
        },

        displayTrailer() {
            const coinGen = buyableEffect(this.layer, this.id)
            const totalCoinGen = getPointGen()
            const effectPercent = totalCoinGen.neq(0)
                ? coinGen.div(totalCoinGen).mul(100)
                : 0

            return `Coins/Sec: ${format(coinGen)} [${format(effectPercent)}%]`
        },

        ...otherArgs,
    })
}

function coinBuyable({
    title,
    baseCost,
    unlockAmount = 0,
    costExponent,
    displayTrailer = () => '',
    ...otherArgs
}) {
    return {
        title,

        display() {
            const manuallyBoughtAmount = getBuyableAmount(this.layer, this.id)
            // TODO Don't hardcode
            const autoBoughtAmount = 0

            const cost = tmp[this.layer].buyables[this.id].cost

            return `Amount: ${manuallyBoughtAmount} [+${autoBoughtAmount}]
                    Cost: ${format(cost)}
                    ${displayTrailer.call(this)}`
        },

        unlocked() {
            return player.best.gte(unlockAmount)
        },

        canAfford() {
            return player.points.gte(this.cost())
        },

        // TODO In Synergism, more than 1 can be bought at a time
        buy() {
            player.points = player.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },

        ...otherArgs,
    }
}
