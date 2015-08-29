import React from 'react'

export default class Menu extends React.Component {
  handleOnClick (e) {
    e.preventDefault()
    this.props.onQuitClick()
  }

  render () {
    var statusNode
    var buttonText = 'Quit'
    if (this.props.status === 'update-available') {
      statusNode = <span className='status icon icon-download pull-left'> Update available</span>
      buttonText = 'Quit and update'
    }

    return (
      <div className='bar bar-standard bar-footer'>
        {statusNode}
        <button className='btn pull-right' onClick={this.handleOnClick.bind(this)}>
          {buttonText}
        </button>
      </div>
    )
  }
}

Menu.propTypes = {
  status: React.PropTypes.string.isRequired,
  onQuitClick: React.PropTypes.func.isRequired
}
