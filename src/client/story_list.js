import React from 'react'
import Story from './story.js'
import _ from 'underscore'

export default class StoryList extends React.Component {
  render () {
    var onUrlClick = this.props.onUrlClick
    var storyNodes = _.map(this.props.stories, function (story) {
      return (
        <li key={story.rank} className='table-view-cell media'>
          <Story story={story} onUrlClick={onUrlClick} />
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
  stories: React.PropTypes.array.isRequired
}
