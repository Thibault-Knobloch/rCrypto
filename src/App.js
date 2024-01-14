import React, { useEffect } from 'react'
import Header from './components/Header'
import Main from './components/Main'
import { useMoralis } from "react-moralis"


function App() {

  const Moralis = useMoralis()

  async function init() {
    await Moralis.enable();
    await Moralis.initPulgins();
  }

  // initialize moralis and oneInch
  useEffect(() => {
    console.log('Rerendered App.js');
    init()
  }, [])


  return (
    <div>
      <Header />
      <div>
        <Main />
      </div>
    </div>

  );
}

export default App;
