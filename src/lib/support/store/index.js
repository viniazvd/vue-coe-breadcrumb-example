export default {
  state: {
    crumbs: [],
    loaderMsg: '',
    separator: '',
    hidden: [],
    loading: false
  },

  getters: {
    __crumbs: ({ crumbs }) => crumbs,

    __loaderMsg: ({ loaderMsg }) => loaderMsg,

    __separator: ({ separator }) => separator,

    __loading: ({ loading }) => loading,

    __hidden: ({ hidden }) => hidden
  },

  mutations: {
    SYNC_STORE: (state, crumbs) => (state.crumbs = crumbs),

    SYNC_ROUTE: (state, crumbs) => (state.crumbs = crumbs),

    SET_SEPARATOR: (state, separator) => (state.separator = separator),

    SET_LOADER: (state, loaderMsg) => (state.loaderMsg = loaderMsg),

    SET_HIDDEN: (state, hidden) => (state.hidden = hidden),

    HANDLE_LOADER: (state, status) => (state.loading = status)
  },

  actions: {
    BREADCRUMB_SYNC_STORE: ({ commit, getters }, { routes, label, name, hidden }) => {
      console.log('store', routes)

      const remaped = routes
        .map(route => {
          // console.log(route.name === name, label)
          // console.log('route', route)
          return (route.name === name && {
            name: route.name,
            meta: route.meta,
            params: route.params,
            redirect: route.redirect,
            label
          }) || route
        })
        .filter(route => !hidden.includes(route.name))

      commit('SYNC_STORE', remaped)
    },

    BREADCRUMB_SYNC_ROUTE: ({ commit, getters }, { matched, query = {}, params = {} }) => {
      const crumbs = getters['__crumbs']
      const hidden = getters['__hidden']

      const lastQuery = Object.values(query)[0]
      const lastParam = Object.values(params)[Object.keys(params).length - 1]

      // console.log(lastQuery, lastParam)

      const added = matched
        .map((crumb, index) => {
          return {
            name: crumb.name,
            meta: crumb.meta,
            params: crumb.params,
            redirect: crumb.redirect,
            label: (matched.length - 1 === index && (lastQuery || lastParam)) || (crumbs[index] && crumbs[index].label)
          }
        })
        .filter(route => !hidden.includes(route.name))

      console.log('route', added)
      commit('SYNC_ROUTE', added)
    },

    BREADCRUMB_SET_SEPARATOR: ({ commit }, separator) => commit('SET_SEPARATOR', separator),

    BREADCRUMB_SET_LOADER: ({ commit }, loaderMsg) => commit('SET_LOADER', loaderMsg),

    BREADCRUMB_SET_HIDDEN: ({ commit }, hidden) => commit('SET_HIDDEN', hidden),

    BREADCRUMB_LOADER: ({ commit }, status) => commit('HANDLE_LOADER', status)
  }
}
