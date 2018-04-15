import {
  Button,
  Divider,
  Dropdown,
  Grid,
  GridColumn,
  GridRow,
  Icon,
  Menu,
  MenuItem,
  Sidebar,
} from 'semantic-ui-react'
import { Link, Route, Switch } from 'react-router-dom'
import React, { Component, Fragment } from 'react'

import Axios from 'axios'
import StudentTable from '../../components/StudentTable'
import TeamTable from '../../components/TeamTable'
import qs from 'qs'
import routes from './components/routes'
import { withNotifications } from '../../providers/NotificationsProvider'
import { withSession } from '../../providers/SessionProvider'

class InstructorPage extends Component {
  state = {
    sections: [],
    loadingSections: true,
    sidebarVisible: false,
    section: null,
  }

  componentWillUpdate(nextProps) {
    if (
      nextProps.location.pathname === '/instructor' &&
      this.props.location.pathname !== '/instructor'
    ) {
      this.componentDidMount()
    }
  }

  changeSection = (e, { value }) => {
    this.setState({ section: value })
  }

  async componentDidMount() {
    try {
      const { data } = await Axios.get(
        '/api/sections?' +
          qs.stringify({
            relations: [
              'students',
              'students.games',
              'teams',
              'teams.games',
              'teams.students',
            ],
            order: { name: 'ASC' },
          })
      )
      const sections = data.data.map(section => {
        section.students = section.students
          .map(student => {
            student.hasLost = false
            for (const game of student.games) {
              if (game.opponentScore > game.score) {
                student.hasLost = true
                break
              }
            }
            return student
          })
          .sort((a, b) => {
            if (!a.hasLost && b.hasLost) return -1
            if (a.hasLost && !b.hasLost) return 1

            const nameA = a.lastName.toLowerCase()
            const nameB = b.lastName.toLowerCase()
            if (nameA < nameB) return -1
            if (nameB < nameA) return 1
            return 0
          })

        section.teams = section.teams.map(team => {
          team.hasLost = false
          for (const game of team.games) {
            if (game.opponentScore > game.score) {
              team.hasLost = true
              break
            }
          }
          return team
        })
        return section
      })

      this.setState({ sections })
      if (sections.length) {
        this.setState({ section: data.data[0].id })
      }
    } catch ({ response }) {
      this.props.notifications.addMessage(response.data.message, 'error')
    } finally {
      this.setState({ loadingSections: false })
    }
  }

  logout = async () => {
    try {
      await Axios.post('/api/logout')
      this.props.session.changeSession(null)
    } catch ({ response }) {
      this.props.notifications.addMessage(response.data.message, 'error')
    }
  }

  toggleSidebar = () => {
    this.setState({ sidebarVisible: !this.state.sidebarVisible })
  }

  render() {
    const { pathname } = this.props.location
    const title =
      pathname === '/instructor/add-section'
        ? 'Add Section'
        : pathname === '/instructor/add-team'
          ? 'Add Team'
          : 'Instructor'

    const currentSection = this.state.sections.find(
      section => section.id === this.state.section
    )
    return (
      <Fragment>
        <Menu
          secondary
          borderless
          fluid
          size="massive"
          attached="top"
          style={{ margin: 0, borderTop: 0, borderRight: 0, borderLeft: 0 }}
        >
          <MenuItem
            onClick={
              pathname === '/instructor'
                ? this.toggleSidebar
                : this.props.history.goBack
            }
          >
            <Icon name={pathname === '/instructor' ? 'bars' : 'arrow left'} />
          </MenuItem>
          <MenuItem header>{title}</MenuItem>
        </Menu>
        <Sidebar.Pushable>
          <Sidebar
            as={Menu}
            animation="overlay"
            width="thin"
            visible={this.state.sidebarVisible}
            vertical
          >
            <MenuItem
              onClick={() => {
                this.props.history.push('/instructor/add-section')
                this.toggleSidebar()
              }}
            >
              Add Section
            </MenuItem>
            <MenuItem
              onClick={() => {
                this.props.history.push('/instructor/add-team')
                this.toggleSidebar()
              }}
            >
              Add Team
            </MenuItem>
            <MenuItem onClick={this.logout}>Log out</MenuItem>
          </Sidebar>
          <Sidebar.Pusher
            dimmed={this.state.sidebarVisible}
            style={{ height: 'calc(100vh - 52px)', overflowY: 'auto' }}
            onClick={() => {
              this.setState({ sidebarVisible: false })
            }}
          >
            <Switch>
              {routes.map(route => <Route key={route.path} {...route} />)}
              <Route
                path="/"
                render={() => (
                  <Grid style={{ margin: 0 }}>
                    <GridRow centered>
                      <GridColumn width={16}>
                        {this.state.sections.length ? (
                          <Dropdown
                            fluid
                            selection
                            search
                            options={this.state.sections.map(section => ({
                              text: section.name,
                              value: section.id,
                            }))}
                            value={this.state.section}
                            onChange={this.changeSection}
                          />
                        ) : (
                          <Link to="/instructor/add-section">
                            <Button primary fluid>
                              Add Section
                            </Button>
                          </Link>
                        )}
                      </GridColumn>
                    </GridRow>
                    {currentSection &&
                      (currentSection.students.length ? (
                        <Fragment>
                          {currentSection.students.map(student => (
                            <GridRow centered key={student.id}>
                              <GridColumn width={16}>
                                <StudentTable {...student} />
                              </GridColumn>
                            </GridRow>
                          ))}
                          {!!currentSection.teams.length && <Divider />}
                          {currentSection.teams.map(team => (
                            <GridRow centered key={team.id}>
                              <GridColumn width={16}>
                                <TeamTable {...team} />
                              </GridColumn>
                            </GridRow>
                          ))}
                        </Fragment>
                      ) : (
                        <GridRow centered>
                          <GridColumn width={16}>
                            <p>No students yet.</p>
                          </GridColumn>
                        </GridRow>
                      ))}
                  </Grid>
                )}
              />
              />
            </Switch>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Fragment>
    )
  }
}

export default withSession(withNotifications(InstructorPage))
