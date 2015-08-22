import React from 'react'
import Story from './story.js'

export default class StoryList extends React.Component {
  render() {
    var onCommentClick = this.props.onCommentClick
    var storyNodes = this.props.data.map(function (story) {
      return (
        <li key={story.rank} className="table-view-cell media">
          <Story data={story} onCommentClick={onCommentClick} />
        </li>
      )
    })
    return (
      <ul className="content table-view">
        {storyNodes}
        <br/>
      </ul>
    )
  }
}
