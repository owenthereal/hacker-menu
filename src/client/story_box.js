import React from 'react'
import _ from 'underscore'
import Client from 'electron-rpc/client'
import StoryList from './story_list.js'
import Spinner from './spinner.js'
import Menu from './menu.js'
import StoryType from '../model/story_type'

export default class StoryBox extends React.Component {
  constructor (props) {
    super(props)

    this.client = new Client()
    this.state = {
      stories: [],
      selected: StoryType.TOP_TYPE,
      status: '',
      version: '',
      upgradeVersion: ''
    }
    this.storycb = null
  }

  componentDidMount () {
    var self = this

    self.client.on('update-available', function (err, releaseVersion) {
      if (err) {
        console.error(err)
        return
      }

      self.setState({ status: 'update-available', upgradeVersion: releaseVersion })
    })

    self.client.request('current-version', function (err, version) {
      if (err) {
        console.error(err)
        return
      }

      self.setState({ version: version })
    })

    self.onNavbarClick(self.state.selected)
  }

  onQuitClick () {
    this.client.request('terminate')
  }

  onUrlClick (url) {
    this.client.request('open-url', { url: url })
  }

  onMarkAsRead (id) {
    this.client.request('mark-as-read', { id: id }, function () {
      var story = _.findWhere(this.state.stories, { id: id })
      story.hasRead = true
      this.setState({ stories: this.state.stories })
    }.bind(this))
  }

  onNavbarClick (selected) {
    var self = this

    self.setState({ stories: [], selected: selected })

    if (self.storycb) {
      self.client.removeListener(selected, self.storycb)
    }

    self.storycb = function (err, storiesMap) {
      if (err) {
        return
      }

      // console.log(JSON.stringify(Object.keys(storiesMap), null, 2))

      var stories = storiesMap[self.state.selected]
      if (!stories) {
        return
      }

      // console.log(JSON.stringify(stories, null, 2))
      self.setState({stories: stories})
    }

    self.client.request(selected, self.storycb)
    self.client.on(selected, self.storycb)
  }

  render () {
    var navNodes = _.map(StoryType.ALL, function (selection) {
      var className = 'control-item'
      if (this.state.selected === selection) {
        className = className + ' active'
      }
      return (
        <a key={selection} className={className} onClick={this.onNavbarClick.bind(this, selection)}>{selection}</a>
      )
    }, this)

    var content = null
    if (_.isEmpty(this.state.stories)) {
      content = <Spinner />
    } else {
      content = <StoryList stories={this.state.stories} onUrlClick={this.onUrlClick.bind(this)} onMarkAsRead={this.onMarkAsRead.bind(this)} />
    }

    return (
      <div className='story-menu'>
        <header className='bar bar-nav'>
          <div className='segmented-control'>
            {navNodes}
          </div>
        </header>
        {content}
        <Menu onQuitClick={this.onQuitClick.bind(this)} status={this.state.status} version={this.state.version} upgradeVersion={this.state.upgradeVersion} />
      </div>
    )
  }
}
