import React from 'react'
import _ from 'underscore'
import Client from 'electron-rpc/client'
import StoryList from './story_list.js'
import Menu from './menu.js'
import StoryWatcher from './story_watcher.js'

export default class StoryBox extends React.Component {
  constructor (props) {
    super(props)

    this.client = new Client()
    this.state = { stories: [], selected: StoryWatcher.TOP_TYPE, status: StoryWatcher.SYNCING_STATUS }
    this.watcher = new StoryWatcher('https://hacker-news.firebaseio.com/v0')
  }
  componentDidMount () {
    this.watcher.on('status', function (status) {
      this.setState({ status: status })
    }.bind(this))
    this.onNavbarClick(this.state.selected)
  }
  onQuitClick () {
    this.client.request('terminate')
  }
  onCommentClick (url) {
    this.client.request('open-url', { url: url })
  }
  onNavbarClick (selected) {
    this.watcher.unwatchAll()
    this.setState({ stories: [], selected: selected })
    this.watcher.watch(selected, function (story) {
      // console.log(JSON.stringify(this.state.stories, null, 2))

      this.setState(function (state, props) {
        state.stories[story.rank] = story
      })
    }.bind(this), function (error) {
      console.log(error)
    })
  }
  capitalize (s) {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
  }
  render () {
    var navNodes = _.map([ StoryWatcher.TOP_TYPE, StoryWatcher.SHOW_TYPE, StoryWatcher.ASK_TYPE ], function (selection) {
      var display = this.capitalize(selection)
      var className = 'control-item'
      if (this.state.selected === selection) {
        className = className + ' active'
      }
      return (
        <a key={selection} className={className} onClick={this.onNavbarClick.bind(this, selection)}>{display}</a>
      )
    }, this)
    return (
      <div className='storyMenu'>
        <header className='bar bar-nav'>
          <div className='segmented-control'>
            {navNodes}
          </div>
        </header>
        <StoryList stories={this.state.stories} onCommentClick={this.onCommentClick.bind(this)} />
        <Menu onQuitClick={this.onQuitClick.bind(this)} status={this.state.status} />
      </div>
    )
  }
}
