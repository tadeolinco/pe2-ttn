import Section from '../section/entity'
import Student from './entity'
import { getRepository } from 'typeorm'

export default {
  getAll: {
    method: 'get',
    path: '/students',
    middlewares: [],
    handler: async (req, res) => {
      try {
        const studentRepository = getRepository(Student)

        const students = await studentRepository.find(req.query)

        res.status(200).json({ data: students })
      } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Internal server error.' })
      }
    },
  },

  update: {
    method: 'put',
    path: '/students/:id',
    middlewares: [],
    handler: async (req, res) => {
      try {
        const studentRepository = getRepository(Student)
        if (req.body.sectionId) {
          const sectionRepository = getRepository(Section)
          const section = await sectionRepository.findOneById(
            req.body.sectionId
          )
          delete req.body.sectionId
          req.body.section = section
        }

        await studentRepository.updateById(req.params.id, req.body)

        const student = await studentRepository.find(req.params.id)

        res.status(200).json({ data: student })
      } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Internal server error.' })
      }
    },
  },

  add: {
    method: 'post',
    path: '/students',
    middlewares: [],
    handler: async (req, res) => {
      try {
        console.log(req.body)
        const studentRepository = getRepository(Student)
        const sectionRepository = getRepository(Section)
        const section = await sectionRepository.findOneById(req.body.sectionId)
        const student = await studentRepository.save({ ...req.body, section })
        res.status(200).json({ data: student })
      } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Internal server error.' })
      }
    },
  },
}
