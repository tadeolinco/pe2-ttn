import Team from './entity'
import { getRepository } from 'typeorm'
import Section from '../section/entity'
import Student from '../student/entity'

export default {
  add: {
    method: 'post',
    path: '/teams',
    middlewares: [],
    handler: async (req, res) => {
      try {
        const teamRepository = getRepository(Team)
        const sectionRepository = getRepository(Section)
        const studentRepository = getRepository(Student)
        const section = await sectionRepository.findOneById(req.body.sectionId)

        const students = await studentRepository.findByIds(req.body.studentIds)
        const team = await teamRepository.save({ section, students })

        res.status(200).json({ data: team })
      } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Internal server error.' })
      }
    },
  },
}
