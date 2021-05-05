//const TOKEN_IDENTIFIER = '900c7670-0ace-4810-9e52-20c3172b7108'
//const TOKEN_KEY = '144d10a0a1395eef3dceb8d76406a57a576d426acf17cb833195e8f729964266'
const WEBSITE_ID = 'cff3239f-5cde-4a71-a394-b7300e63dd58'

export default {
    install(app) {
        const store = app.config.globalProperties.$store
        store.commit('initStore')

        window.$crisp = [];
        window.CRISP_WEBSITE_ID = WEBSITE_ID;
        window.CRISP_RUNTIME_CONFIG = {
            session_merge: true
        };
        window.CRISP_READY_TRIGGER = function () {
            store.commit('setCrispReady')
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