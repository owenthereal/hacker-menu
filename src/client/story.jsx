import React from 'react'

export default class Story extends React.Component {
  render() {
    var url = "https://news.ycombinator.com/item?id=" + this.props.data.id
    return (
      <div className="story">
        <a href={url} target="_blank">{this.props.data.title}</a>
      </div>
    )
  }
}
