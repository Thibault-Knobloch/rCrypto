import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { MoralisProvider } from 'react-moralis'



ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider appId='BePvUwRDuareLyX89AlM8yomqeVBIVisnNxOX1K6' serverUrl='https://4ppaso9hkcbt.usemoralis.com:2053/server'>
      <App />
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

