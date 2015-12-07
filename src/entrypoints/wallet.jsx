import React from 'react'
import ReactDOM from 'react-dom'
import paqs from 'paqs'
import '../styles/wallet.css'
import Wallet from '../components/Wallet.jsx'

const query = paqs(window.location.search)

ReactDOM.render(<Wallet {...query} />, document.getElementById('root'))
