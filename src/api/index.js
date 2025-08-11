export default {
  auth: {
    login: '/auth/login',
  },
  members: {
    getAll: '/members',
    getById: (id) => `/members/${id}`,
    create: '/members',
    update: (id) => `/members/${id}`,
    delete: (id) => `/members/${id}`,
  },
}
