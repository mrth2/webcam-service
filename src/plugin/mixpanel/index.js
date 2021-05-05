import mixpanel from 'mixpanel-browser'

export default {
    install(app, {config, token}) {
        const store = app.config.globalProperties.$store
        store.commit('initStore')
        const userID = store.getters['getUserID']

        if (typeof config !== 'object') config = {}
        const defaultConfig = {
            loaded() {
                store.commit('setMixpanelReady')
                mixpanel.identify(userID)
                app.config.globalProperties.$mixpanel = mixpanel
            }
        }
        const endConfig = Object.assign(config, defaultConfig)

        mixpanel.init(token, endConfig)
    }
}
