import React from 'react'

export default class Menu extends React.Component {
  handleOnClick (e) {
    e.preventDefault()
    this.props.onQuitClick()
  }

  render () {
    var statusNode
    if (this.props.status === 'updated') {
      statusNode = <span className='status icon icon-check pull-left'> Up to date</span>
    } else {
      statusNode = <span className='status icon icon-more pull-left'> Syncing</span>
    }

    return (
      <div className='bar bar-standard bar-footer'>
        {statusNode}
        <button className='btn pull-right' onClick={this.handleOnClick.bind(this)}>
          Quit
        </button>
      </div>
    )
  }
}

Menu.propTypes = {
  status: React.PropTypes.string.isRequired,
  onQuitClick: React.PropTypes.func.isRequired
}
