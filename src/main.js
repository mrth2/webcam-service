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
    token: '4a8ed81bcb8a334186d34cf7fd1e5c89',
    config: {
        debug: true
    }
})
app.use(VueCrisp)
app.mount('#app')
