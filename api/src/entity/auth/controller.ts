import Instructor from '../instructor/entity'
import Student from '../student/entity'
import { getRepository } from 'typeorm'

export default {
  login: {
    method: 'post',
    path: '/login',
    middlewares: [],
    handler: async (req, res) => {
      try {
        let user = null
        if (req.body.studentNumber) {
          const studentRepository = getRepository(Student)
          user = await studentRepository.findOne({
            studentNumber: req.body.studentNumber,
            password: req.body.password,
          })
        } else {
          const instrucorRepository = getRepository(Instructor)
          user = await instrucorRepository.findOne({
            username: req.body.username,
            password: req.body.password,
          })
        }
        if (!user) {
          return res.status(404).json({ message: 'Wrong credentials.' })
        }
        req.session.user = user
        res.status(200).json({ data: req.session.user })
      } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Internal server error.' })
      }
    },
  },

  logout: {
    method: 'post',
    path: '/logout',
    middlewares: [],
    handler: async (req, res) => {
      try {
        await req.session.destroy()
        res.status(200).json({ data: null })
      } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Internal server error.' })
      }
    },
  },

  session: {
    method: 'post',
    path: '/session',
    middlewares: [],
    handler: async (req, res) => {
      try {
        res.status(200).json({ data: req.session.user || null })
      } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Internal server error.' })
      }
    },
  },
}
