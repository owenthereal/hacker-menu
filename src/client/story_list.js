import React from 'react'
import Story from './story.js'
import _ from 'underscore'

export default class StoryList extends React.Component {
  render () {
    var onUrlClick = this.props.onUrlClick
    var onMarkAsRead = this.props.onMarkAsRead
    var storyNodes = _.map(this.props.stories, function (story, index) {
      return (
        <li key={index} className='table-view-cell media'>
          <Story story={story} onUrlClick={onUrlClick} onMarkAsRead={onMarkAsRead}/>
        </li>
      )
    })
    return (
      <ul className='content table-view'>
        {storyNodes}
      </ul>
    )
  }
}

StoryList.propTypes = {
  onUrlClick: React.PropTypes.func.isRequired,
  onMarkAsRead: React.PropTypes.func.isRequired,
  stories: React.PropTypes.array.isRequired
}
