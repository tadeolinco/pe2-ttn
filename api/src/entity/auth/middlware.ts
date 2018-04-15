export const isStudent = (req, res, next) => {
  if (req.session.user.studentNumber) {
    return next()
  }

  res.status(403).json({ message: 'Wrong account type.' })
}

export const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    return next()
  }

  res.status(403).json({ message: 'Must be logged in' })
}

export const isInstructor = (req, res, next) => {
  if (req.session.user.username) {
    return next()
  }

  res.status(403).json({ message: 'Wrong account type.' })
}
