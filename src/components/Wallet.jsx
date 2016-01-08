import React, { Component, PropTypes } from 'react'
import Dialog from './Dialog.jsx'

export default class Wallet extends Component {
  static propTypes = {
    amount: PropTypes.string.isRequired,
    return: PropTypes.string.isRequired
  }
  render () {
    return <Dialog title='Confirm Send'>
      <p>Are you sure you wish to send ${this.props.amount}?</p>
      <p><button onClick={::this.handleConfirm}>Confirm</button></p>
    </Dialog>
  }

  handleConfirm () {
    window.location.href = this.props.return
  }
}
