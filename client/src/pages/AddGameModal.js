import { Button, Form, FormInput, Message, Modal } from 'semantic-ui-react'
import React, { Component } from 'react'

import withForm from '../util/withForm'
import Axios from 'axios'
import { withNotifications } from '../providers/NotificationsProvider'

class AddGameModal extends Component {
  componentDidMount() {
    this.props.form.set.score(null, { value: '0' })
  }

  addGame = async () => {
    try {
      const { form, type, id } = this.props
      const body = {
        score: +form.score,
        opponentScore: +form.opponentScore,
      }
      if (type === 'team') body.teamId = id
      else body.studentId = id

      await Axios.post('/api/games', body)
      this.props.notifications.addMessage('Added match!', 'success')
      this.props.toggleModal('')
    } catch ({ response }) {
      this.props.notifications.addMessage(response.data.message, 'error')
    }
  }

  render() {
    const { trigger, form, open, type } = this.props
    return (
      <Modal
        open={type === open}
        trigger={trigger}
        size="fullscreen"
        className="scrolling"
        closeIcon
        onClose={() => this.props.toggleModal('')}
        onOpen={() => this.props.toggleModal(type)}
        onMount={() => {
          form.reset.score()
          form.reset.opponentScore()
        }}
      >
        <Modal.Header>Add Match</Modal.Header>
        <Modal.Content>
          {!!form.errors.length && <Message error list={form.errors} />}
          <Form onSubmit={this.addGame}>
            <FormInput
              label="Score"
              type="number"
              value={form.score}
              onChange={form.set.score}
            />
            <FormInput
              label="Opponent's Score"
              type="number"
              value={form.opponentScore}
              onChange={form.set.opponentScore}
            />
            <Button primary fluid type="submit" disabled={!!form.errors.length}>
              Add
            </Button>
          </Form>
        </Modal.Content>
      </Modal>
    )
  }
}

export default withNotifications(
  withForm(AddGameModal, {
    score: {
      initialValue: '0',
      validator: (value, form) => {
        value = +value
        if (value < 0) return 'Score cannot be negative.'

        if (value === +form.state.opponentScore) {
          return 'Match cannot be a draw.'
        }

        if (form.state.errors['opponentScore'] === 'Match cannot be a draw.') {
          form.state.errors['opponentScore'] = null
          form.setState(form.state)
        }
      },
    },

    opponentScore: {
      initialValue: '0',
      validator: (value, form) => {
        value = +value
        if (value < 0) return "Opponent's score cannot be negative."
        if (value === +form.state.score) {
          return 'Match cannot be a draw.'
        }
        if (form.state.errors['score'] === 'Match cannot be a draw.') {
          form.state.errors['score'] = null
          form.setState(form.state)
        }
      },
    },
  })
)
