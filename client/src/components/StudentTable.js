import React from 'react'

import { Table } from 'semantic-ui-react'

const StudentTable = ({
  lastName,
  firstName,
  studentNumber,
  games,
  hasLost,
}) => {
  return (
    <Table
      color={hasLost ? 'red' : 'green'}
      celled
      unstackable
      size="small"
      striped
    >
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell colSpan="2">
            {lastName}, {firstName}
          </Table.HeaderCell>
        </Table.Row>
        {!!games.length && (
          <Table.Row>
            <Table.HeaderCell>W/L</Table.HeaderCell>
            <Table.HeaderCell>Score</Table.HeaderCell>
          </Table.Row>
        )}
      </Table.Header>
      <Table.Body>
        {games.length ? (
          games.map(({ score, opponentScore, id }) => {
            return (
              <Table.Row key={id}>
                <Table.Cell>{score > opponentScore ? 'W' : 'L'}</Table.Cell>
                <Table.Cell>
                  {score} - {opponentScore}
                </Table.Cell>
              </Table.Row>
            )
          })
        ) : (
          <Table.Row>
            <Table.Cell colSpan="2">
              <p>No matches yet.</p>
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  )
}

export default StudentTable
