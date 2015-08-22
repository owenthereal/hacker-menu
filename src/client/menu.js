import React from 'react'

export default class Menu extends React.Component {
  handleOnClick (e) {
    e.preventDefault()
    this.props.onQuitClick()
  }

  render () {
    return (
      <div className='bar bar-standard bar-footer'>
        <button className='btn pull-right' onClick={this.handleOnClick.bind(this)}>
          Quit
        </button>
      </div>
    )
  }
}

Menu.propTypes = {
  onQuitClick: React.PropTypes.func.isRequired
}
