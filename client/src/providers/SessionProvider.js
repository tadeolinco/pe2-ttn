import React, { Component } from 'react'

const SessionContext = React.createContext()

export class SessionProvider extends Component {
  state = {
    user: null,
    changeSession: user => {
      this.setState({ user })
    },
  }

  render() {
    return (
      <SessionContext.Provider value={this.state}>
        {this.props.children}
      </SessionContext.Provider>
    )
  }
}

export const withSession = Component => props => (
  <SessionContext.Consumer>
    {session => <Component {...props} session={session} />}
  </SessionContext.Consumer>
)
