import { isLoggedIn, isStudent } from '../auth/middlware'

import Game from './entity'
import Student from '../student/entity'
import Team from '../team/entity'
import { getRepository } from 'typeorm'

export default {
  add: {
    method: 'post',
    path: '/games',
    middlewares: [isLoggedIn, isStudent],
    handler: async (req, res) => {
      try {
        const gameRepository = getRepository(Game)

        const body: any = {
          score: req.body.score,
          opponentScore: req.body.opponentScore,
        }
        if (req.body.teamId) {
          const teamRepository = getRepository(Team)
          const team = await teamRepository.findOneById(req.body.teamId)
          body.team = team
        } else {
          const studentRepository = getRepository(Student)
          const student = await studentRepository.findOneById(
            req.session.user.id,
          )
          body.student = student
        }

        const game = await gameRepository.save(body)
        res.status(200).json({ data: game })
      } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Internal server error.' })
      }
    },
  },
}
