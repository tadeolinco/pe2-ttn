import {
  Button,
  Checkbox,
  Dropdown,
  Form,
  FormInput,
  Grid,
  GridColumn,
  GridRow,
  Icon,
  Menu,
  MenuItem,
  Message,
} from 'semantic-ui-react'
import React, { Component, Fragment } from 'react'

import Axios from 'axios'
import qs from 'qs'
import withForm from '../util/withForm'
import { withNotifications } from '../providers/NotificationsProvider'

class SignupPage extends Component {
  state = {
    sections: [],
    loading: false,
    loadingSections: true,
  }

  async componentDidMount() {
    try {
      const { data } = await Axios.get(
        '/api/sections?' + qs.stringify({ order: { name: 'ASC' } })
      )
      this.setState({
        sections: data.data.map(section => ({
          text: section.name,
          value: section.id,
        })),
      })
    } catch ({ response }) {
      this.props.notifications.addMessage(response.data.message, 'error')
    } finally {
      this.setState({ loadingSections: false })
    }
  }

  signUp = async e => {
    try {
      const { form } = this.props
      this.setState({ loading: true })
      await Axios.post('/api/students', {
        firstName: form.firstName,
        lastName: form.lastName,
        studentNumber: form.studentNumber,
        password: form.password,
        sectionId: form.sectionId,
        willPlaySingles: form.willPlaySingles,
        willPlayDoubles: form.willPlayDoubles,
      })
      this.props.history.goBack()
      this.props.notifications.addMessage('Successfully signed up!', 'success')
    } catch ({ response }) {
      this.setState({ loading: false })
      this.props.notifications.addMessage(response.data.message, 'error')
    }
  }

  render() {
    const { form } = this.props
    return (
      <Fragment>
        <Menu
          borderless
          fluid
          size="massive"
          attached="top"
          style={{ margin: 0, borderTop: 0, borderRight: 0, borderLeft: 0 }}
        >
          <MenuItem onClick={() => this.props.history.goBack()}>
            <Icon color="blue" name="arrow left" />
          </MenuItem>
          <MenuItem header name="Sign up" />
        </Menu>
        <Grid style={{ margin: 0 }}>
          <GridRow centered>
            <GridColumn width={13}>
              {!!form.errors.length && <Message error list={form.errors} />}
              <Form onSubmit={this.signUp}>
                <FormInput
                  placeholder="Student Number"
                  value={form.studentNumber}
                  onChange={form.set.studentNumber}
                />
                <FormInput
                  placeholder="Password"
                  type="password"
                  value={form.password}
                  onChange={form.set.password}
                />
                <FormInput
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={form.set.firstName}
                />
                <FormInput
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={form.set.lastName}
                />
                <Dropdown
                  selection
                  fluid
                  search
                  placeholder="Section"
                  value={form.sectionId}
                  onChange={form.set.sectionId}
                  options={this.state.sections}
                  loading={this.state.loadingSections}
                  noResultsMessage="No sections."
                  style={{ margin: '0 0 1em' }}
                />
                <Checkbox
                  label="Will play Singles"
                  checked={form.willPlaySingles}
                  onChange={() =>
                    form.set.willPlaySingles(null, {
                      value: !form.willPlaySingles,
                    })
                  }
                />
                <br />

                <Checkbox
                  style={{ marginTop: '1em' }}
                  label="Will play Doubles"
                  checked={form.willPlayDoubles}
                  onChange={() =>
                    form.set.willPlayDoubles(null, {
                      value: !form.willPlayDoubles,
                    })
                  }
                />

                <Button
                  style={{ marginTop: '1em' }}
                  primary
                  type="submit"
                  fluid
                  loading={this.state.loading}
                  disabled={!form.valid}
                >
                  Sign up
                </Button>
              </Form>
            </GridColumn>
          </GridRow>
        </Grid>
      </Fragment>
    )
  }
}

export default withNotifications(
  withForm(SignupPage, {
    studentNumber: {
      validator: async value => {
        if (!value) {
          return 'Student number is required.'
        }

        if (!/^[0-9]{4}-[0-9]{5}$/.test(value)) {
          return 'Student number must be valid.'
        }
        const { data } = await Axios.get(
          '/api/students?' + qs.stringify({ where: { studentNumber: value } })
        )
        if (data.data.length) {
          return 'Student number is already taken.'
        }
      },
    },

    firstName: {
      validator: value => {
        if (!value) {
          return 'First name is required.'
        }
      },
    },

    lastName: {
      validator: value => {
        if (!value) {
          return 'Last name is required.'
        }
      },
    },

    sectionId: {
      validator: value => {
        if (!value) {
          return 'Section is required.'
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

    willPlaySingles: {
      initialValue: true,
    },

    willPlayDoubles: {
      initialValue: false,
    },
  })
)
