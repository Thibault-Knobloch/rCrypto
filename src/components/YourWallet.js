import React, { useState, useEffect } from 'react'
import { useMoralis } from "react-moralis";
import TokenHolding from './TokenHolding'
import { v4 as uuid } from 'uuid';

export var idList = []
export var numberOfTokens = 0
export const tokenToIdMapping = {}
export const tokenToPriceMapping = {}
export const current_percentages = {}
export var current_portfolio_total = 0


const YourWallet = () => {
    const { Moralis, account, isAuthenticated, chainId } = useMoralis()

    const [balances, setBalances] = useState([])

    useEffect(() => {
        if (isAuthenticated) {
            const options = { chain: chainId, address: account }
            const promise = Moralis.Web3API.account.getTokenBalances(options);
            promise.then((response) => {
                setBalances(response)
                numberOfTokens = response.length
            })
        }
    }, [isAuthenticated, chainId, account])

    useEffect(() => {
        // will run everytime wallet is rendered
        console.log('re-rendered wallet', ' Chain: ', chainId, ' Account: ', account, ' is authenticated: ', isAuthenticated, 'mapping: ', tokenToIdMapping);
    })

    var portfolioTotal = 0

    setTimeout(() => {
        idList.map((id) => {
            try {
                const token_total = document.getElementById(id).dataset.total
                portfolioTotal += parseFloat(token_total)
                document.getElementById('portfolio_total').innerHTML = `($${portfolioTotal.toFixed(2)})`
                document.getElementById('portfolio_total').data('portfoliototal', portfolioTotal);
                return portfolioTotal
            } catch {
                return null
            }
        })

        idList.map((id) => {
            current_portfolio_total = portfolioTotal
            try {
                if (balances.length != 0) {
                    const token_total = document.getElementById(id).dataset.total
                    const thisId = `percentage_${id}`
                    const percentage = ((token_total / portfolioTotal) * 100)
                    const index = idList.indexOf(id)
                    const modded_index = index % numberOfTokens
                    const token_symbol = balances[modded_index]['symbol']

                    // create current percentages mapping
                    current_percentages[token_symbol] = percentage

                    document.getElementById(thisId).innerHTML = `${percentage.toFixed(2)} %`
                    document.getElementById(thisId).dataset.percentage = percentage

                    // create token symbol to ID mapping
                    tokenToIdMapping[token_symbol] = id

                    // create token to token price mapping
                    const this_token_price = document.getElementById(`${token_symbol}_token_price`).dataset.tokenprice
                    tokenToPriceMapping[token_symbol] = this_token_price

                    return tokenToIdMapping, current_percentages
                } else {
                    return null
                }

            } catch {
                idList = idList.filter(thisId => thisId !== id)
                return null
            }
        })

    }, 2000);

    if (!isAuthenticated) {
        return <>
            <h2>Please Connect</h2>
        </>
    }
    if (isAuthenticated) {
        if (balances.length === 0) {
            return (
                <div>
                    <h1 style={{ marginBottom: '20px', textDecoration: 'underline' }}>Your crypto holdings</h1>
                    <h2>You do not have any tokens on the selected blockchain. (id: {chainId})</h2>
                </div>
            )
        }

        return (
            <div>
                <h1 style={{ marginBottom: '20px' }}>
                    <span style={{ textDecoration: 'underline' }}>Your crypto holdings</span>
                    <span id='portfolio_total' data-portfoliototal={0} style={{ color: 'rgb(100,100,100', fontSize: '25px', marginLeft: '15px' }}> (loading...)</span>
                </h1>

                {balances.map((token) => {
                    console.log('new token: ', token);
                    const unique_id = uuid();
                    const small_id = unique_id.slice(0, 8)
                    idList.push(small_id)
                    return <TokenHolding key={small_id} itemId={small_id} token={token} portfolioTotal={portfolioTotal} />
                })}

            </div>
        )

    }

}

export default YourWallet