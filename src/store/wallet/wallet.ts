export default {
  namespaced: true,
  state() {
    return {
      activeClient: null,
      authorized: false,
    }
  },
  getters: {
    client: (state) => state.activeClient,
    signer: (state) => {
      if (state.activeClient) {
        return state.activeClient.signer
      } else {
        return null
      }
    },
  },
  mutations: {
    SET_ACTIVE_WALLET(state, wallet) {
      state.activeWallet = wallet
      window.localStorage.setItem('lastWallet', wallet.name)
    },
    SET_ACTIVE_CLIENT(state, client) {
      state.activeClient = client
      state.authorized = true
    },
    SIGN_OUT(state) {
      state.activeClient = null
      state.authorized = false
    },
  },
  actions: {
    signOut({ commit }) {
      commit('SIGN_OUT')
    },
    signIn({ commit }, { keplr }) {
      commit('SET_ACTIVE_CLIENT', { signer: keplr })
    },
  },
}
