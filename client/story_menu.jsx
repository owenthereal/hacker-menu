import React from 'react'
import Client from 'electron-rpc/client'
import StoryList from './story_list.jsx'
import Menu from './menu.jsx'
import HN from './hn.js'

export default class StoryMenu extends React.Component {
  constructor(props) {
    super(props)

    this.client = new Client()
    this.state = { data: [] }
    this.hn = new HN("https://hacker-news.firebaseio.com/v0")
    this.hn.start()
  }
  componentDidMount() {
    this.hn.on("story", function (story) {
      //console.log(JSON.stringify(this.state.data, null, 2))

      var data = this.state.data
      data[story.rank] = story
      this.setState({data: data})
    }.bind(this))
  }
  onQuitClick() {
    this.client.request('terminate')
  }
  render() {
    return (
      <div className="storyMenu">
        <StoryList data={this.state.data} />
        <Menu onQuitClick={this.onQuitClick.bind(this)} />
      </div>
    )
  }
}
