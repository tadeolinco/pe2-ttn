import Instructor from './entity'
import { getRepository } from 'typeorm'

export default {
  add: {
    method: 'post',
    path: '/instructors',
    middlewares: [],
    handler: async (req, res) => {
      try {
        const instructorRepository = getRepository(Instructor)

        const instructor = await instructorRepository.save(req.body)

        res.status(200).json({ data: instructor })
      } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Internal server error.' })
      }
    },
  },
}
