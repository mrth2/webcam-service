import {createStore} from 'vuex'
import {v4 as uuidv4, validate} from 'uuid';

export default createStore({
    state: {
        crispReady: false,
        mixpanelReady: false,
        userID: null,
        settings: {
            cloudname: 'live-legrandfourire',
            preset: 'my-unsigned-preset'
        }
    },
    getters: {
        getUserID(state) {
            return state.userID
        },
        isAppReady(state) {
            return state.crispReady && state.mixpanelReady
        }
    },
    mutations: {
        initStore(state) {
            const userID = localStorage.getItem('userID')
            if (userID && validate(userID)) {
                state.userID = userID
            } else {
                state.userID = uuidv4()
                localStorage.setItem('userID', state.userID)
            }
        },
        setCrispReady(state) {
            state.crispReady = true
        },
        setMixpanelReady(state) {
            state.mixpanelReady = true
        },
        updateCloudname(state, cloudname) {
            state.settings.cloudname = cloudname
        },
        updatePreset(state, preset) {
            state.settings.preset = preset
        }
    }
})
