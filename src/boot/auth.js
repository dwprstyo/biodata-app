import { boot } from 'quasar/wrappers'

export default boot(({ router }) => {
  router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token')

    if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
      next({ path: '/auth/login' })
    } else {
      next()
    }
  })
})
