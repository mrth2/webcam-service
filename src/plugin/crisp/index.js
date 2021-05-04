//import Crisp from 'node-crisp-api'

//const TOKEN_IDENTIFIER = '900c7670-0ace-4810-9e52-20c3172b7108'
//const TOKEN_KEY = '144d10a0a1395eef3dceb8d76406a57a576d426acf17cb833195e8f729964266'
//const WEBSITE_ID = 'e382ad75-e919-48f8-b3f8-4a16a9bea010'

export default {
    install(app) {
        const store = app.config.globalProperties.$store
        store.commit('initStore')

        window.$crisp = [];
        window.CRISP_WEBSITE_ID = "e382ad75-e919-48f8-b3f8-4a16a9bea010";
        window.CRISP_RUNTIME_CONFIG = {
            session_merge: true
        };
        window.CRISP_READY = false
        window.CRISP_READY_TRIGGER = function () {
            window.CRISP_READY = true
            app.config.globalProperties.$crisp = window.$crisp
        };
        window.CRISP_TOKEN_ID = store.getters['getUserID'];

        (function () {
            const d = document,
                s = d.createElement("script");
            s.src = "https://client.crisp.chat/l.js";
            s.async = true;
            d.getElementsByTagName("head")[0].appendChild(s);
        })();
    }
}