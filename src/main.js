import {createApp} from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import VueMixpanel from '@/plugin/mixpanel/index.js'
import VueCrisp from '@/plugin/crisp/index.js'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(VueMixpanel, {
    token: 'b0022491a5bf716993bdbbeac23717b7',
    config: {
        debug: true
    }
})
app.use(VueCrisp)
app.mount('#app')
