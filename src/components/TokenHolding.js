import React, { useState, useEffect } from 'react'
import { useMoralis } from "react-moralis";

const extra_symbols = ['BTCB']

const TokenHolding = ({ token, itemId }) => {
    const { Moralis, isAuthenticated, chainId, account } = useMoralis()
    console.log(token);

    // get token balances and image
    const symbol = token['symbol']

    const token_balance = parseInt(token['balance'])
    const formatted_balance = token_balance / (10 ** parseInt(token['decimals']))

    // get current token prices
    const [tokenPrice, setTokenPrice] = useState({ 'usdPrice': 0 })

    const token_address = token['token_address']
    useEffect(() => {
        if (isAuthenticated) {
            const options = { chain: chainId, address: token_address }
            const promise = Moralis.Web3API.token.getTokenPrice(options)
            promise.then((response) => {
                setTokenPrice(response)
            })
        }
    }, [isAuthenticated, chainId, account])

    // get the right logo for the tokens
    var tokenImg = ''

    try {
        //console.log(`../static/SVG-icons/${symbol.toString().toLowerCase()}.svg`);
        if (symbol.toString().toLowerCase() == 'btcb') {
            tokenImg = require(`../static/SVG-icons/btc.svg`)
        } else {
            tokenImg = require(`../static/SVG-icons/${symbol.toString().toLowerCase()}.svg`)
        }

        //tokenImg = require(`../static/SVG-icons/${'ada'.toString().toLocaleLowerCase()}.svg`)
        console.log('found: ', tokenImg);
    } catch {
        console.log('no token img found');
    }


    return (
        <div style={{ marginBottom: '10px' }}>
            <div style={{ alignItems: 'center', display: 'inline-flex' }}>
                <img alt='' src={tokenImg} style={{ width: '30px', marginRight: '15px' }} />
                <h3 style={{ width: '130px', textAlign: 'left', marginLeft: '10px' }}>{symbol}:  {formatted_balance.toFixed(2)}</h3>
                <h4 style={{ marginLeft: '70px', color: 'rgb(100, 100, 100)' }} id={`${symbol}_token_price`} data-tokenprice={tokenPrice['usdPrice']}>${tokenPrice['usdPrice'].toFixed(2)}</h4>
                <h4 value={(formatted_balance * tokenPrice['usdPrice'])} style={{ marginLeft: '60px', color: 'rgb(100, 100, 100)' }}>
                    $<span id={itemId} data-total={(formatted_balance * tokenPrice['usdPrice'])}>{(formatted_balance * tokenPrice['usdPrice']).toFixed(2)}</span>
                </h4>
                <h3 id={`percentage_${itemId}`} style={{ marginLeft: '100px' }} data-percentage=''>%</h3>
            </div>
        </div>
    )
}

export default TokenHolding