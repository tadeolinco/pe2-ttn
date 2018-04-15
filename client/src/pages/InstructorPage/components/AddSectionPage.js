import {
  Button,
  Form,
  FormInput,
  Grid,
  GridColumn,
  GridRow,
  Message,
} from 'semantic-ui-react'
import React, { Component } from 'react'

import Axios from 'axios'
import qs from 'qs'
import withForm from '../../../util/withForm'
import { withNotifications } from '../../../providers/NotificationsProvider'

class AddSectionPage extends Component {
  state = {
    loading: false,
  }

  addSection = async e => {
    try {
      e.preventDefault()
      await Axios.post('/api/sections', { name: this.props.form.name })
      this.props.notifications.addMessage(
        `Added ${this.props.form.name} section.`,
        'success'
      )
      this.props.history.goBack()
    } catch ({ response }) {
      this.props.notifications.addMessage(response.data.message, 'error')
    }
  }

  render() {
    const { form } = this.props
    return (
      <Grid style={{ margin: 0 }}>
        <GridRow centered>
          <GridColumn width={16}>
            {!!form.errors.length && <Message error list={form.errors} />}
            <Form onSubmit={this.addSection}>
              <FormInput
                placeholder="Section name"
                value={form.name}
                onChange={form.set.name}
              />
              <Button
                primary
                type="submit"
                fluid
                loading={this.state.loading}
                disabled={!form.valid}
              >
                Add Section
              </Button>
            </Form>
          </GridColumn>
        </GridRow>
      </Grid>
    )
  }
}

export default withNotifications(
  withForm(AddSectionPage, {
    name: {
      validator: async value => {
        if (!value) {
          return 'Section name is required.'
        }

        const { data } = await Axios.get(
          '/api/sections?' + qs.stringify({ where: { name: value } })
        )

        if (data.data.length) {
          return 'Section name already taken'
        }
      },
    },
  })
)
