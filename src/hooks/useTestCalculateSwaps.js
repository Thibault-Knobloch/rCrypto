
class Swap {
    constructor(from, to, amount) {
        this.from = from;
        this.to = to;
        this.amount = amount;
    }
}

const current_portfolio_total = 1000

const current_percentages = {
    'ADA': 45, // $450
    'BTC': 15, // $150
    'ETH': 20, // $300
    'FTM': 20  // $100
}
const goal_percentages = {
    'ADA': 25, // $250 (-200)
    'BTC': 25, // $250 (+100)
    'ETH': 25, // $250 (-50)
    'FTM': 25  // $250 (+150)
}
const tokenToPriceMapping = {
    'ADA': 1,
    'BTC': 25000,
    'ETH': 2000,
    'FTM': 3
}

const useTestCalculateSwaps = () => {
    // do some math, return list of swaps (custom data type)
    // will show to amount of coins of token1 to convert to token2

    const valueToChange = {}
    const swapsToRebalance = []

    Object.keys(current_percentages).map((token_key) => {
        const current_value = (current_percentages[token_key] / 100) * current_portfolio_total
        var goal_input = goal_percentages[token_key]
        if (isNaN(goal_input)) {
            goal_input = 0
        }
        const goal_value = (goal_input / 100) * current_portfolio_total
        valueToChange[token_key] = current_value - goal_value
    })
    //console.log('current portfolio total: ', current_portfolio_total);
    console.log('value to change: ', valueToChange);
    //console.log('token to price: ', tokenToPriceMapping);

    var sortedValues = Object.keys(valueToChange).map(function (key) {
        return [key, valueToChange[key]];
    });

    // Sort the array based on the second element
    sortedValues.sort(function (first, second) {
        return second[1] - first[1];
    });

    const doReverse = (array) => {
        return array.map((item, idx) => array[array.length - 1 - idx])
    }
    var reversedValues = doReverse(sortedValues)

    // separate positive from negative values, still sorted by sides
    sortedValues = sortedValues.filter(item => item[1] > 0)
    reversedValues = reversedValues.filter(item => item[1] < 0)

    for (let index = 0; index < sortedValues.length; ++index) {
        const i_item = sortedValues[index];
        // console.log('OUTER: ', i_item);

        const symbol = i_item[0].toString()
        var value = i_item[1]

        var notExhausted = true
        // this token has too much value, can give some to the one that needs the most
        while (notExhausted) {
            inner: for (let index2 = 0; index2 < reversedValues.length; ++index2) {
                const j_item = reversedValues[index2]
                // console.log('INNER: ', j_item);

                const j_symbol = j_item[0]
                const j_value = j_item[1].toString()
                if (symbol == j_symbol) {
                    continue
                }

                // check if the value one has available is lower, higher or same as the one to rebalance
                if (value > -j_value) {
                    // can swap whole amount, token still not exhausted
                    const tokens_to_swap = ((-j_value) / parseFloat(tokenToPriceMapping[symbol]))
                    const swap = new Swap(symbol, j_symbol, tokens_to_swap)
                    value = parseFloat(value) + parseFloat(j_value)
                    swapsToRebalance.push(swap)

                    // Remove the rebalanced token from list
                    reversedValues.splice(reversedValues.findIndex(item => item[0] === j_symbol), 1);

                    if (value.toFixed(4) == 0) {
                        notExhausted = false
                    }
                } else if (value < -j_value) {
                    // can swap whole value, then token is exhausted
                    const tokens_to_swap = (value / parseFloat(tokenToPriceMapping[symbol]))
                    const swap = new Swap(symbol, j_symbol, tokens_to_swap)
                    notExhausted = false
                    swapsToRebalance.push(swap)

                    reversedValues[index2][1] += value

                    // dont remove item from list because not fully rebalanced yet
                    continue
                } else {
                    // can swap whole amount, token is then exhausted
                    const tokens_to_swap = (value / parseFloat(tokenToPriceMapping[symbol]))
                    const swap = new Swap(symbol, j_symbol, tokens_to_swap)
                    notExhausted = false
                    swapsToRebalance.push(swap)

                    // Remove the rebalanced token from list
                    reversedValues.splice(reversedValues.findIndex(item => item[0] === j_symbol), 1);
                    reversedValues.splice(reversedValues.findIndex(item => item[0] === symbol), 1);

                    continue
                }
            }
        }
        if (value == 0) {
            // this should be the last thing that runs (or not run at all)
            console.log('do nothing, no rebalancing needed/possible');
        }
    }

    console.log('Swaps to rebalance: ', swapsToRebalance);

    var this_swaps_correctly = false
    const value_changed = {}
    for (var i = 0; i < swapsToRebalance.length; i++) {
        const swap = swapsToRebalance[i]
        if (value_changed[swap.from]) {
            value_changed[swap.from] += swap.amount * tokenToPriceMapping[swap.from]
        } else {
            value_changed[swap.from] = swap.amount * tokenToPriceMapping[swap.from]
        }
        if (value_changed[swap.to]) {
            value_changed[swap.to] -= swap.amount * tokenToPriceMapping[swap.from]
        } else {
            value_changed[swap.to] = -(swap.amount * tokenToPriceMapping[swap.from])
        }

    }
    console.log('value changed: ', value_changed);


    return swapsToRebalance
}

useTestCalculateSwaps()
