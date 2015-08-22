import React from 'react'
import Story from './story.js'
import _ from 'underscore'

export default class StoryList extends React.Component {
  render () {
    var onCommentClick = this.props.onCommentClick
    var storyNodes = _.map(this.props.stories, function (story) {
      return (
        <li key={story.rank} className='table-view-cell media'>
          <Story story={story} onCommentClick={onCommentClick} />
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
  onCommentClick: React.PropTypes.string.isRequired,
  stories: React.PropTypes.string.isRequired
}
