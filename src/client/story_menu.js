import React from 'react'
import Client from 'electron-rpc/client'
import StoryList from './story_list.js'
import Menu from './menu.js'
import HN from './hn.js'

export default class StoryMenu extends React.Component {
  constructor(props) {
    super(props)

    this.client = new Client()
    this.state = { data: [], selected: "top" }
    this.hn = new HN("https://hacker-news.firebaseio.com/v0")
    this.hn.start()
  }
  componentDidMount() {
    this.hn.on(this.state.selected, function (story) {
      //console.log(JSON.stringify(this.state.data, null, 2))

      var data = this.state.data
      data[story.rank] = story
      this.setState({data: data})
    }.bind(this))
  }
  onQuitClick() {
    this.client.request('terminate')
  }
  onCommentClick(url) {
    this.client.request('open-url', { url: url })
  }
  onNavbarClick(selected, e) {
    this.setState({selected: selected})
  }
  render() {
    var selectionNodes = [ "top", "show", "ask" ].map(function(selection) {
      var display = selection.charAt(0).toUpperCase() + selection.slice(1)
      var className = "control-item"
      if (this.state.selected == selection) {
        className = className + " active"
      }
      return (
        <a key={selection} className={className} onClick={this.onNavbarClick.bind(this, selection)}>{display}</a>
      )
    }.bind(this))
    return (
      <div className="storyMenu">
        <nav className="bar bar-nav">
          <div className="segmented-control">
            {selectionNodes}
          </div>
        </nav>
        <StoryList data={this.state.data} onCommentClick={this.onCommentClick.bind(this)} />
        <Menu onQuitClick={this.onQuitClick.bind(this)} />
      </div>
    )
  }
}
