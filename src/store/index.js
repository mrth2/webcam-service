import {createStore} from 'vuex'
import {v4 as uuidv4, validate} from 'uuid';

export default createStore({
    state: {
        crispReady: false,
        mixpanelReady: false,
        userID: null,
        cloudinary: {
            cloudname: 'sparkling',
            preset: 'live.legrandfourire'
        },
        ziggeoGranted: true,
        ziggeoApiKey: '14372b7e9d5b5ba36818404d7f49ddd5',
        ziggeoPrivateKey: '760b5203249c1ade3fe57a2eb44be50a',
        ziggeoEncryptionKey: 'f8fc712304f00a89608a4e81d12c6428',
        mainSiteBase: 'https://legrandfourire.com'
    },
    getters: {
        getCloudinaryConfig(state) {
            return state.cloudinary
        },
        getUserID(state) {
            return state.userID
        },
        isAppReady(state) {
            return state.crispReady && state.mixpanelReady
        },
        isZiggeoPermissionGranted(state) {
            return state.ziggeoGranted
        },
        getZiggeoApiKey(state) {
            return state.ziggeoApiKey
        },
        getZiggeoApplicationKeys(state) {
            return {
                token: state.ziggeoApiKey,
                privateKey: state.ziggeoPrivateKey,
                encryptionKey: state.ziggeoEncryptionKey
            }
        },
        getMainSiteBase(state) {
            return state.mainSiteBase
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
        },
        setZiggeoGranted(state, grant) {
            state.ziggeoGranted = grant
        }
    }
})
