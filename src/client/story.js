import React from "react"

export default class Story extends React.Component {
  handleCommentOnClick(e) {
    e.preventDefault()
    this.props.onCommentClick(this.props.data.yurl)
  }
  render() {
    var story = this.props.story
    return (
      <a href={story.url} target="_blank" className="navigate-right">
        <span className="badge" onClick={this.handleCommentOnClick.bind(this)}>{story.descendants}</span>
        <div className="media-body">
          {story.title}
          <p>{story.host} {story.timeAgo}</p>
          <p>{story.score} points</p>
        </div>
      </a>
    )
  }
}
