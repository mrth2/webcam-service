import {createStore} from 'vuex'
import { v4 as uuidv4, validate } from 'uuid';

export default createStore({
    state: {
        userID: null
    },
    getters: {
        getUserID(state) {
            return state.userID
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
        }
    }
})
