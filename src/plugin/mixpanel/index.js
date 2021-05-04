import mixpanel from 'mixpanel-browser'

export default {
    install(app, {config, token}) {
        if (typeof config !== 'object') config = {}
        const defaultConfig = {}
        const endConfig = Object.assign(config, defaultConfig)

        mixpanel.init(token, endConfig)

        const store = app.config.globalProperties.$store
        store.commit('initStore')
        const userID = store.getters['getUserID']
        mixpanel.identify(userID)

        app.config.globalProperties.$mixpanel = mixpanel
    }
}
