import React from 'react'

export default class Menu extends React.Component {
  handleOnClick (e) {
    e.preventDefault()
    this.props.onQuitClick()
  }

  render () {
    var statusText = 'v' + this.props.version
    var buttonText = 'Quit'
    if (this.props.status === 'update-available') {
      statusText += ' (v' + this.props.upgradeVersion + ' available, restart to upgrade)'
      buttonText = 'Restart'
    }

    return (
      <div className='bar bar-standard bar-footer'>
        <span className='status pull-left'>{statusText}</span>
        <button className='btn pull-right' onClick={this.handleOnClick.bind(this)}>
          {buttonText}
        </button>
      </div>
    )
  }
}

Menu.propTypes = {
  status: React.PropTypes.string.isRequired,
  version: React.PropTypes.string.isRequired,
  upgradeVersion: React.PropTypes.string.isRequired,
  onQuitClick: React.PropTypes.func.isRequired
}
