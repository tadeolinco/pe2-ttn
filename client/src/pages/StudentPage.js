import { Button, Divider, Grid, GridColumn, GridRow } from 'semantic-ui-react'
import React, { Component, Fragment } from 'react'

import Axios from 'axios'
import FullLoader from '../components/FullLoader'
import StudentTable from '../components/StudentTable'
import TeamTable from '../components/TeamTable'
import qs from 'qs'
import { withNotifications } from '../providers/NotificationsProvider'
import { withSession } from '../providers/SessionProvider'
import AddGameModal from './AddGameModal'

class StudentPage extends Component {
  state = {
    student: null,
    loading: true,
    open: '',
  }

  toggleModal = open => {
    if (!open) {
      this.componentDidMount()
    }
    this.setState({ open })
  }

  logout = async () => {
    try {
      await Axios.post('/api/logout')
      this.props.session.changeSession(null)
    } catch ({ response }) {
      this.props.notifications.addMessage(response.data.message, 'error')
    }
  }

  async componentDidMount() {
    try {
      const { data } = await Axios.get(
        '/api/students?' +
          qs.stringify({
            relations: ['team', 'team.games', 'team.students', 'games'],
            where: { id: this.props.session.user.id },
          })
      )

      const student = data.data[0]
      console.log(student)
      student.games.sort((a, b) => a.dateCreated - b.dateCreated)

      student.hasLost = false
      for (const game of student.games) {
        if (game.score < game.opponentScore) {
          student.hasLost = true
          break
        }
      }

      if (student.team) {
        student.team.games.sort((a, b) => a.dateCreated - b.dateCreated)
        student.team.hasLost = false
        for (const game of student.team.games) {
          if (game.score < game.opponentScore) {
            student.team.hasLost = true
            break
          }
        }
      }

      this.setState({ student, loading: false })
    } catch (err) {
      console.log(err)
      // this.props.notifications.addMessage(response.data.message, 'error')
      this.setState({ loading: false })
    }
  }

  render() {
    if (this.state.loading) return <FullLoader />
    const { student } = this.state
    console.log(student)
    return (
      <Grid style={{ margin: 0 }}>
        {student.willPlaySingles && (
          <Fragment>
            <GridRow centered>
              <GridColumn width={16}>
                <StudentTable {...student} />
              </GridColumn>
            </GridRow>
            {!student.hasLost && (
              <GridRow centered>
                <GridColumn width={16}>
                  <AddGameModal
                    toggleModal={this.toggleModal}
                    open={this.state.open}
                    id={student.id}
                    type="student"
                    trigger={
                      <Button primary fluid>
                        Add Match for Student
                      </Button>
                    }
                  />
                </GridColumn>
              </GridRow>
            )}
          </Fragment>
        )}

        {student.team && (
          <Fragment>
            {student.willPlaySingles && <Divider />}
            <GridRow centered>
              <GridColumn width={16}>
                <TeamTable {...student.team} />
              </GridColumn>
            </GridRow>
            {!student.team.hasLost && (
              <GridRow centered>
                <GridColumn width={16}>
                  <AddGameModal
                    toggleModal={this.toggleModal}
                    open={this.state.open}
                    id={student.team.id}
                    type="team"
                    trigger={
                      <Button primary fluid>
                        Add Match for Team
                      </Button>
                    }
                  />
                </GridColumn>
              </GridRow>
            )}
          </Fragment>
        )}

        <GridRow centered>
          <GridColumn width={16}>
            <Button primary fluid onClick={this.logout}>
              Log out
            </Button>
          </GridColumn>
        </GridRow>
      </Grid>
    )
  }
}

export default withNotifications(withSession(StudentPage))
