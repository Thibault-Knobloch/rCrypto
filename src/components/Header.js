import React from 'react'
import logo from '../static/crypto.png'
import ConnectButton from './ConnectButton'


const Header = () => {
    return (
        <div id="header_div" style={{ width: '95%', margin: 'auto' }}>
            <div id="logo_div" style={{ width: '500px', marginTop: '20px', marginLeft: '10px' }}>
                <div style={{ float: 'left', marginRight: '10px' }}>
                    <img className='logo_img' src={logo} alt='logo' />
                </div>
                <div style={{ paddingTop: '5px', color: 'white' }}>
                    <h2>RCrypto</h2>
                </div>
            </div>

            <div id="connect_div" style={{ marginTop: '-30px' }}>
                <ConnectButton />
            </div>
        </div>
    )
}

export default Header