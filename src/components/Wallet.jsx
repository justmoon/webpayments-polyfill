import React, { Component, PropTypes } from 'react'
import Dialog from './Dialog.jsx'

export default class Wallet extends Component {
  static propTypes = {
    amount: PropTypes.string.isRequired
  }
  render () {
    return <Dialog title='Confirm Send'>
      <p>Are you sure you wish to send ${this.props.amount}?</p>
      <p><button>Confirm</button></p>
    </Dialog>
  }
}
