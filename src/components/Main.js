import React from 'react'
import YourWallet from './YourWallet'
import Rebalance from './Rebalance'
import { useMoralis } from "react-moralis";
import { numberOfTokens } from './YourWallet'

export class Swap {
    constructor(from, to, amount) {
        this.from = from;
        this.to = to;
        this.amount = amount;
    }
}

export const chainIdToNameMapping = {
    '0x1': 'eth',
    '0x38': 'bsc',
    '0x4': 'rinkeby'
}


const Main = () => {
    const { isAuthenticated } = useMoralis()


    const container_style = {
        margin: 'auto',
        width: '80%',
        marginTop: '130px',
        backgroundColor: 'rgb(240, 240, 240)',
        borderRadius: '1rem',
        textAlign: 'center',
        paddingTop: '10px',
        paddingBottom: '10px',
        maxWidth: '900px',
        maxHeight: '450px',
        overflow: 'auto'
    }
    const container_closer_style = {
        margin: 'auto',
        width: '80%',
        marginTop: '50px',
        backgroundColor: 'rgb(240, 240, 240)',
        borderRadius: '1rem',
        textAlign: 'center',
        paddingTop: '10px',
        paddingBottom: '10px',
        maxWidth: '900px',
        maxHeight: '450px',
        overflow: 'auto'
    }



    return (
        <div>
            <div style={container_style}>
                <YourWallet />
            </div>
            {isAuthenticated ? (

                <div style={container_closer_style}>
                    <Rebalance />
                </div>

            ) : (
                    <></>
                )}

        </div>

    )
}

export default Main