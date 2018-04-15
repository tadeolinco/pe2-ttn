import React, { Component } from 'react'
import { Redirect, Route, Switch, withRouter } from 'react-router-dom'

import Axios from 'axios'
import FullLoader from './components/FullLoader'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import routes from './routes'
import { withNotifications } from './providers/NotificationsProvider'
import { withSession } from './providers/SessionProvider'

class App extends Component {
  state = {
    loading: true,
  }

  async componentDidMount() {
    try {
      const { data } = await Axios.post('/api/session')
      this.props.session.changeSession(data.data)
      if (data.data) {
        if (data.data.studentNumber) {
          this.props.history.push('/student')
        } else {
          this.props.history.push('/instructor')
        }
      } else {
        this.props.history.push('/login')
      }
    } catch ({ response }) {
      this.props.notifications.addMessage(response.data.message, 'error')
    } finally {
      this.setState({ loading: false })
    }
  }

  render() {
    if (this.state.loading) return <FullLoader />
    if (!this.props.session.user)
      return (
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={SignupPage} />
          <Redirect to="/login" />
        </Switch>
      )
    return (
      <Switch>
        {routes.map(route => <Route key={route.path} {...route} />)}
        <Redirect
          to={
            this.props.session.user.studentNumber ? '/student' : '/instructor'
          }
        />
      </Switch>
    )
  }
}

export default withRouter(withSession(withNotifications(App)))
