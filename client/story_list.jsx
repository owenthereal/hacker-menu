import React from 'react'
import Story from './story.jsx'

export default class StoryList extends React.Component {
  render() {
    var storyNodes = this.props.data.map(function (story) {
      return (
        <Story key={story.id} data={story} />
      )
    })
    return (
      <div className="storyList">
        {storyNodes}
      </div>
    )
  }
}
