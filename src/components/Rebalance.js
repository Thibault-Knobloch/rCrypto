import { Button, CircularProgress } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import { useMoralis } from "react-moralis"
import { tokenToPriceMapping, current_percentages } from './YourWallet'
import { v4 as uuid } from 'uuid';
import { useCalculateSwaps } from '../hooks/useCalculateSwaps'
import { chainIdToNameMapping } from './Main'

// https://www.youtube.com/watch?v=44ItBuw86AA&t=4s
// https://www.youtube.com/watch?v=gLJ4YejmG2E&t=65s

const Rebalance = () => {

    const { Moralis, account, isAuthenticated, chainId } = useMoralis()

    const [balances, setBalances] = useState([])

    const tokenInputs = {}
    var totalPercentage = 0

    useEffect(() => {
        // will run everytime the rebalance is rerendered
        console.log('rerendered rebalance');
    })

    useEffect(() => {
        if (isAuthenticated) {
            const options = { chain: chainId, address: account }
            const promise = Moralis.Web3API.account.getTokenBalances(options);
            promise.then((response) => {
                setBalances(response)
            })
        }
    }, [isAuthenticated, chainId, account, Moralis.Web3API.account])

    const [isRebalancing, setIsRebalancing] = useState(false)

    const RebalanceHoldings = (e) => {
        e.preventDefault()
        setIsRebalancing(true)

        // get swaps needed to rebalance in object form
        const swapsToRebalance = useCalculateSwaps(current_percentages, tokenInputs, tokenToPriceMapping)
        console.log('Swaps: ', swapsToRebalance);

        // add a check that the current percentages are correct (before calling calculateSwaps, check all percentages to prevent false rebalancing)

        // perform the swaps using moralis API (need plugin, YT tutorial)

        setTimeout(() => {
            setIsRebalancing(false)
        }, 2000);
    }

    const handleChange = (e) => {
        const token_symbol = e.target.dataset.token
        totalPercentage = 0
        tokenInputs[token_symbol] = parseFloat(e.target.value)

        // get total percentage inputted by user
        Object.keys(tokenInputs).map((token_key) => {
            if (isNaN(tokenInputs[token_key])) {
                totalPercentage += 0
            } else {
                totalPercentage += tokenInputs[token_key]
            }
            return null
        })
        document.getElementById('percent_to_rebalance').innerHTML = `${(100 - totalPercentage).toFixed(2)}%`

        // adjust the indication to user above input fields
        if (totalPercentage > 100) {
            document.getElementById('percent_heading').style.visibility = 'visible'
            document.getElementById('rebalance_button').disabled = true
            document.getElementById('rebalance_button').style.opacity = 0.2
            document.getElementById('percent_heading').innerHTML = 'Remove:'
            document.getElementById('percent_heading').style.color = 'black'
            document.getElementById('percent_to_rebalance').style.visibility = 'visible'
            document.getElementById('percent_to_rebalance').style.color = 'red'
        } else if (totalPercentage < 100) {
            document.getElementById('percent_heading').style.visibility = 'visible'
            document.getElementById('rebalance_button').disabled = true
            document.getElementById('rebalance_button').style.opacity = 0.2
            document.getElementById('percent_heading').innerHTML = 'Add:'
            document.getElementById('percent_heading').style.color = 'black'
            document.getElementById('percent_to_rebalance').style.visibility = 'visible'
            document.getElementById('percent_to_rebalance').style.color = 'black'
        } else {
            document.getElementById('percent_heading').style.visibility = 'hidden'
            document.getElementById('percent_to_rebalance').style.color = 'green'
            document.getElementById('percent_to_rebalance').innerHTML = 'Ready!'
            document.getElementById('rebalance_button').disabled = false
            document.getElementById('rebalance_button').style.opacity = 1
        }

        // adjust the indication about percent change current to gaol percentage
        const token_current = current_percentages[token_symbol]
        const token_goal = tokenInputs[token_symbol]
        const token_change = (token_goal - token_current)
        if (token_change > 0) {
            document.getElementById(`${token_symbol}_percent_change`).style.color = 'green'
            document.getElementById(`${token_symbol}_percent_change`).innerHTML = `+${token_change.toFixed(2)}%`
        } else if (token_change < 0) {
            document.getElementById(`${token_symbol}_percent_change`).style.color = 'red'
            document.getElementById(`${token_symbol}_percent_change`).innerHTML = `${token_change.toFixed(2)}%`
        } else {
            document.getElementById(`${token_symbol}_percent_change`).style.color = 'black'
            document.getElementById(`${token_symbol}_percent_change`).innerHTML = `+${token_change.toFixed(2)}%`
        }
    }

    const getSupportedTokens = async () => {
        console.log(Moralis.Plugins.oneInch.getSupportedTokens);
        console.log('getting supported tokens for chainId: ', chainId);

        const promise = Moralis.Plugins.oneInch.getSupportedTokens({ chain: chainIdToNameMapping[chainId] })
        promise.then((response) => {
            console.log(response);
            const supportedTokens = response.tokens;
            console.log('data: ', supportedTokens);
        })

    }




    return (
        <div>

            <h1 style={{ marginBottom: '10px' }}>
                <span style={{ textDecoration: 'underline' }}>Rebalance your holdings</span>
            </h1>

            <h3 id='percent_heading' style={{ marginBottom: '0px' }}>To rebalance:</h3>
            <h2 style={{ marginBottom: '20px' }} id='percent_to_rebalance'>100%</h2>


            <form onSubmit={RebalanceHoldings}>
                <div style={{ display: 'block', alignContent: 'center' }}>
                    {balances.map((token) => {
                        const symbol = token['symbol']
                        var tokenImg = ''
                        try {
                            tokenImg = require(`../static/SVG-icons/${symbol.toString().toLowerCase()}.svg`)
                        } catch {
                            console.log('no token img found');
                        }

                        const unique_id = uuid();
                        const small_id = unique_id.slice(0, 8)

                        return (
                            <div style={{ marginBottom: '15px' }} key={small_id}>
                                <div style={{ alignItems: 'center', display: 'inline-flex' }}>
                                    <img alt='' src={tokenImg} style={{ width: '30px', marginRight: '15px' }} />
                                    <h3 style={{ width: '70px', textAlign: 'left', marginLeft: '10px' }}>{symbol}</h3>
                                    <input className='percentage_input'
                                        style={{ marginLeft: '40px', color: 'rgb(100, 100, 100)', width: '50px', height: '25px', textAlign: 'center', fontSize: '18px' }}
                                        type='number'
                                        step='0.01'
                                        min='0'
                                        max='100'
                                        name={`${symbol}_input`}
                                        data-token={symbol}
                                        onChange={handleChange}
                                    />
                                    <h3 style={{ marginLeft: '15px' }}>%</h3>
                                    <h3 style={{ marginLeft: '80px', width: '50px', alignContent: 'center' }} id={`${symbol}_percent_change`}>--</h3>
                                </div>
                            </div>
                        )
                    })}

                </div>
                <div style={{ marginBottom: '15px' }}>
                    <div style={{ alignItems: 'center', display: 'inline-flex' }}>
                        <img alt='' src='' style={{ width: '30px', marginRight: '15px' }} />
                        <h3 style={{ width: '70px', textAlign: 'left', marginLeft: '10px' }}>ADD</h3>
                        <input list="browsers" />
                        <datalist id="browsers">
                            <option value="Internet Explorer" />
                            <option value="Firefox" />
                            <option value="Chrome" />
                            <option value="Opera" />
                            <option value="Safari" />
                        </datalist>
                        <h3 style={{ marginLeft: '80px', width: '50px', alignContent: 'center' }} id={`new_percent_change`}>--</h3>
                    </div>
                </div>
                <button type='button' onClick={getSupportedTokens}>Click Me</button>


                {isRebalancing ? (
                    <Button
                        type='submit'
                        color="primary"
                        variant="contained"
                        disabled={true}>
                        <CircularProgress size={25} />
                    </Button>
                ) : (
                        <Button
                            id='rebalance_button'
                            type='submit'
                            color="primary"
                            variant="contained"
                            disabled={false}>
                            Rebalance
                        </Button>
                    )}

            </form>

        </div>
    )
}

export default Rebalance
