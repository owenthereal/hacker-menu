import React from 'react'

export default class Story extends React.Component {
  constructor (props) {
    super(props)

    this.state = { hasRead: this.props.story.hasRead }
  }

  markAsRead () {
    this.setState({ hasRead: true })
    this.props.onMarkAsRead(this.props.story.id)
  }

  openUrl (url) {
    this.props.onUrlClick(url)
  }

  handleYurlOnClick (e) {
    e.preventDefault()
    this.openUrl(this.props.story.yurl)
  }

  handleByOnClick (e) {
    e.preventDefault()
    this.openUrl(this.props.story.by_url)
  }

  handleUrlClick (e) {
    e.preventDefault()
    this.markAsRead()
    this.openUrl(this.props.story.url)
  }

  render () {
    var story = this.props.story
    var readIcon
    if (this.state.hasRead) {
      readIcon = <span className="icon icon-star-filled"></span>
    } else {
      readIcon = <span className="icon icon-star"></span>
    }

    return (
      <a href='#'>
        <span className='badge' onClick={this.handleYurlOnClick.bind(this)}>{story.score}</span>
        <div className='media-body'>
          {readIcon}
          <span className='story-title' onClick={this.handleUrlClick.bind(this)}>{story.title}</span>
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
