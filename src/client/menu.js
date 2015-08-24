import React from 'react'
import StoryWatcher from './story_watcher.js'

export default class Menu extends React.Component {
  handleOnClick (e) {
    e.preventDefault()
    this.props.onQuitClick()
  }

  render () {
    var statusNode
    var buttonText = 'Quit'
    if (this.props.status === StoryWatcher.UPDATED_STATUS) {
      statusNode = <span className='status icon icon-check pull-left'> Up to date</span>
    } else if (this.props.status === StoryWatcher.SYNCING_STATUS) {
      statusNode = <span className='status icon icon-more pull-left'> Syncing</span>
    } else if (this.props.status === 'update-available') {
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
