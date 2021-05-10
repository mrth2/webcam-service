import mixpanel from 'mixpanel-browser'

export default {
    install(app, {config, token}) {
        const store = app.config.globalProperties.$store
        store.commit('initStore')

        if (typeof config !== 'object') config = {}
        const defaultConfig = {
            loaded: () => {
                mixpanel.identify(store.getters['getUserID'])
                app.config.globalProperties.$mixpanel = mixpanel
                app.provide('mixpanel', mixpanel)
                store.commit('setMixpanelReady')
            }
        }
        const endConfig = Object.assign(config, defaultConfig)

        mixpanel.init(token, endConfig)
    }
}
