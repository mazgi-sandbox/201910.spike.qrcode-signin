const Default = Object.freeze({
  Create: 'user._.create',
  Read: 'user._.read',
  Update: 'user._.update',
  Delete: 'user._.delete'
})

const Password = Object.freeze({
  Create: 'user.password.create',
  Read: 'user.password.read',
  Update: 'user.password.update',
  Delete: 'user.password.delete'
})

export const User = Object.freeze({
  Default,
  Password
})
