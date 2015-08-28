import React from 'react'

export default class Story extends React.Component {
  handleYurlOnClick (e) {
    e.preventDefault()
    this.props.onUrlClick(this.props.story.yurl)
  }

  handleByOnClick (e) {
    e.preventDefault()
    this.props.onUrlClick(this.props.story.by_url)
  }

  render () {
    var story = this.props.story
    return (
      <a href={story.url} target='_blank'>
        <span className='badge'>{story.score}</span>
        <div className='media-body'>
          <span className='story-title'>{story.title}</span>
          <p className='story-host'>{story.host}</p>
          <p className='story-poster'>
            <span className='icon-comment' onClick={this.handleYurlOnClick.bind(this)}>
              {story.descendants}
            </span> &ndash;&nbsp;
            <span onClick={this.handleByOnClick.bind(this)}>
              {story.by}
            </span> &ndash;&nbsp;
            <span onClick={this.handleYurlOnClick.bind(this)}>
              {story.timeAgo}
            </span>
          </p>
        </div>
      </a>
    )
  }
}

Story.propTypes = {
  onUrlClick: React.PropTypes.func.isRequired,
  story: React.PropTypes.object.isRequired
}
