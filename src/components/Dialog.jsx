import React, { Component, PropTypes } from 'react'
import styles from './Dialog.module.css'

export default class Dialog extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ])
  }

  render () {
    return (
      <div className={'sans-serif ' + styles.dialog}>
        <header className={styles.header}>{this.props.title}</header>
        {this.props.children}
      </div>
    )
  }
}
