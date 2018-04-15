import { isInstructor, isLoggedIn } from '../auth/middlware'

import Instructor from '../instructor/entity'
import Section from './entity'
import { getRepository } from 'typeorm'

export default {
  getAll: {
    method: 'get',
    path: '/sections',
    middlewares: [],
    handler: async (req, res) => {
      try {
        const sectionRepository = getRepository(Section)
        const sections = await sectionRepository.find(req.query)

        res.status(200).json({ data: sections })
      } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Internal server error.' })
      }
    },
  },

  add: {
    method: 'post',
    path: '/sections',
    middlewares: [isLoggedIn, isInstructor],
    handler: async (req, res) => {
      try {
        const instructorRepository = getRepository(Instructor)
        const sectionRepository = getRepository(Section)
        const instructor = await instructorRepository.findOneById(
          req.session.user.id,
        )
        const section = await sectionRepository.save({
          name: req.body.name,
          instructor,
        })

        res.status(200).json({ data: section })
      } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Internal server error.' })
      }
    },
  },
}
