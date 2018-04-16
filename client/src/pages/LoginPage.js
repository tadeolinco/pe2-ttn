import {
  Button,
  ButtonGroup,
  ButtonOr,
  Divider,
  Form,
  FormInput,
  Grid,
  GridColumn,
  GridRow,
  Message,
} from 'semantic-ui-react'
import React, { Component } from 'react'

import Axios from 'axios'
import { Link } from 'react-router-dom'
import withForm from '../util/withForm'
import { withNotifications } from '../providers/NotificationsProvider'
import { withSession } from '../providers/SessionProvider'

class LoginPage extends Component {
  state = { type: 'Student', loading: false }

  login = async e => {
    try {
      e.preventDefault()
      this.setState({ loading: true })
      const body = { password: this.props.form.password }
      if (this.state.type === 'Student') {
        body.studentNumber = this.props.form.studentNumber
      } else {
        body.username = this.props.form.username
      }

      await Axios.post('/api/login', body)
      const { data } = await Axios.post('/api/session')
      this.setState({ loading: false })
      this.props.session.changeSession(data.data)
      this.props.history.push('/' + this.state.type.toLowerCase())
    } catch ({ response }) {
      this.props.notifications.addMessage(response.data.message, 'error')
      this.setState({ loading: false })
    }
  }

  render() {
    const { form } = this.props
    return (
      <Grid style={{ margin: 0 }}>
        <GridRow centered style={{ height: '40vh' }}>
          <GridColumn verticalAlign="middle">
            <h1>PE2 TTN</h1>
          </GridColumn>
        </GridRow>
        <GridRow centered>
          <GridColumn verticalAlign="middle">
            <ButtonGroup>
              <Button
                disabled={this.state.loading && this.state.type !== 'Student'}
                primary={this.state.type === 'Student'}
                onClick={() => {
                  this.setState({ type: 'Student' })
                  form.resetForm()
                }}
              >
                Student
              </Button>
              <ButtonOr />
              <Button
                disabled={
                  this.state.loading && this.state.type !== 'Instructor'
                }
                primary={this.state.type === 'Instructor'}
                onClick={() => {
                  this.setState({ type: 'Instructor' })
                  form.resetForm()
                }}
              >
                Instructor
              </Button>
            </ButtonGroup>
          </GridColumn>
        </GridRow>
        <GridRow centered style={{ paddingBottom: 0 }}>
          <GridColumn width={13}>
            {!!form.errors.length && <Message error list={form.errors} />}
            <Form onSubmit={this.login}>
              <FormInput
                placeholder={
                  this.state.type === 'Student' ? 'Student Number' : 'Username'
                }
                value={
                  this.state.type === 'Student'
                    ? form.studentNumber
                    : form.username
                }
                onChange={
                  this.state.type === 'Student'
                    ? form.set.studentNumber
                    : form.set.username
                }
                error={
                  this.state.type === 'Student'
                    ? form.errors.studentNumber
                    : form.errors.username
                }
              />
              <FormInput
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={form.set.password}
              />
              <Button
                type="submit"
                primary
                fluid
                disabled={
                  !!(
                    (this.state.type === 'Student' && !form.studentNumber) ||
                    (this.state.type === 'Instructor' && !form.username) ||
                    !form.password ||
                    form.errors.length
                  )
                }
                loading={this.state.loading}
              >
                Log in as {this.state.type}
              </Button>
            </Form>
          </GridColumn>
        </GridRow>
        <GridRow centered style={{ paddingTop: 0 }}>
          <GridColumn width={13}>
            <Divider />
            <Button fluid primary disabled={this.state.loading}>
              <Link to="/signup" style={{ color: 'white' }}>
                Sign up
              </Link>
            </Button>
          </GridColumn>
        </GridRow>
      </Grid>
    )
  }
}

export default withNotifications(
  withSession(
    withForm(LoginPage, {
      studentNumber: {
        validator: value => {
          if (!value) {
            return 'Student number is required.'
          }

          if (!/^[0-9]{4}-[0-9]{5}$/.test(value)) {
            return 'Student number must be valid.'
          }
        },
      },

      username: {
        validator: value => {
          if (!value) {
            return 'Username is required.'
          }
        },
      },

      password: {
        validator: value => {
          if (!value) {
            return 'Password is required.'
          }
        },
      },
    })
  )
)
