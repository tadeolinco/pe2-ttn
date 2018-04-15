import {
  Button,
  Dropdown,
  Form,
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

class AddTeamModal extends Component {
  state = {
    loading: false,
    loadingStudents: true,
    sections: [],
  }

  async componentDidMount() {
    try {
      const { data } = await Axios.get(
        '/api/sections?' +
          qs.stringify({
            relations: ['students', 'students.team'],
            order: { name: 'ASC' },
          })
      )

      const sections = data.data.map(section => {
        section.students.sort((a, b) => {
          const nameA = a.lastName.toLowerCase()
          const nameB = b.lastName.toLowerCase()
          if (nameA < nameB) return -1
          if (nameB < nameA) return 1
          return 0
        })
        return section
      })
      this.setState({ sections })
      if (sections.length) {
        this.props.form.set.sectionId(null, { value: sections[0].id })
      }
    } catch ({ response }) {
      this.props.notifications.addMessage(response.data.message, 'error')
    } finally {
      this.setState({ loadingStudents: false })
    }
  }

  addTeam = async e => {
    try {
      const { form } = this.props
      e.preventDefault()
      await Axios.post('/api/teams', {
        studentIds: form.studentIds,
        sectionId: form.sectionId,
      })
      this.props.notifications.addMessage('Added team.', 'success')
      this.props.history.goBack()
    } catch ({ response }) {
      this.props.notifications.addMessage(response.data.message, 'error')
    }
  }

  render() {
    const { form } = this.props
    const currentSection = this.state.sections.find(
      section => section.id === form.sectionId
    )

    return (
      <Grid style={{ margin: 0 }}>
        {currentSection ? (
          <GridRow centered>
            <GridColumn width={16}>
              {!!form.errors.length && <Message error list={form.errors} />}
              <Form onSubmit={this.addTeam}>
                <Dropdown
                  fluid
                  selection
                  search
                  options={this.state.sections.map(section => ({
                    text: section.name,
                    value: section.id,
                  }))}
                  value={form.sectionId}
                  onChange={form.set.sectionId}
                  loading={this.state.loadingStudents}
                  noResultsMessage="No sections."
                  style={{ margin: '0 0 1em' }}
                />

                <Dropdown
                  fluid
                  selection
                  search
                  multiple
                  options={currentSection.students
                    .filter(student => !student.team && student.willPlayDoubles)
                    .map(student => ({
                      text: `${student.lastName}, ${student.firstName}`,
                      value: student.id,
                    }))}
                  placeholder="Students"
                  value={form.studentIds}
                  onChange={form.set.studentIds}
                  style={{ margin: '0 0 1em' }}
                  noResultsMessage="No students."
                  loading={this.state.loadingStudents}
                />
                <Button
                  primary
                  type="submit"
                  fluid
                  loading={this.state.loading}
                  disabled={!form.valid}
                >
                  Add Team
                </Button>
              </Form>
            </GridColumn>
          </GridRow>
        ) : (
          <p>No sections yet.</p>
        )}
      </Grid>
    )
  }
}

export default withNotifications(
  withForm(AddTeamModal, {
    studentIds: {
      initialValue: [],
      validator: (value, form) => {
        if (value.length !== 2) {
          return 'Must have two students in a team.'
        }
      },
    },

    sectionId: {
      initialValue: null,
    },
  })
)
