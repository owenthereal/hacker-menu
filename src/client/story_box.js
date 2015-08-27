import React from 'react'
import _ from 'underscore'
import Client from 'electron-rpc/client'
import StoryList from './story_list.js'
import Menu from './menu.js'
import StoryType from '../model/story_type'
import StoryManagerStatus from '../model/story_manager_status'

export default class StoryBox extends React.Component {
  constructor (props) {
    super(props)

    this.client = new Client()
    this.state = { stories: [], selected: StoryType.TOP_TYPE, status: StoryManagerStatus.SYNCING_STATUS }
  }

  componentDidMount () {
    var self = this

    self.client.on('update-available', function (err, releaseVersion) {
      if (err) {
        console.log(err)
        return
      }

      self.setState({ status: 'update-available' })
    })
    self.client.on('story-manager-status', function (err, status) {
      if (err) {
        console.log(err)
        return
      }

      if (self.state.selected !== status.type) {
        return
      }

      // `update-available` overrides any status
      if (self.state.status !== 'update-available') {
        self.setState({ status: status.status })
      }
    })
    self.onNavbarClick(self.state.selected)
  }

  onQuitClick () {
    this.client.request('terminate')
  }

  onUrlClick (url) {
    this.client.request('open-url', { url: url })
  }

  onNavbarClick (selected) {
    var self = this

    if (self.storycb) {
      self.client.removeListener(selected, self.storycb)
    }

    self.setState({ stories: [], selected: selected })
    self.storycb = function (err, stories) {
      if (err) {
        return
      }

      // console.log(JSON.stringify(stories, null, 2))
      self.setState({stories: stories})
    }
    self.client.request(selected, self.storycb)
    self.client.on(selected, self.storycb)
  }

  capitalize (s) {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
  }

  render () {
    var navNodes = _.map(StoryType.ALL, function (selection) {
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
        <StoryList stories={this.state.stories} onUrlClick={this.onUrlClick.bind(this)} />
        <Menu onQuitClick={this.onQuitClick.bind(this)} status={this.state.status} />
      </div>
    )
  }
}
