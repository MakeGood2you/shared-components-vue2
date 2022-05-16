/** nest-i18n mixin
 *
 * Use this mixin for consistent handling of string translation in our Vue Components.
 *
 * It ensures that if the component is used in an app
 */
import Vue from 'vue';
import Languages from '../i18n'
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);
let locale = 'en-US'

const i18n = new VueI18n({
    locale, // set locale
    fallbackLocale: locale,
    messages: Languages // set locale messages
});

export function getLanguage(lang) {
    locale = lang ? lang : locale
    i18n.locale = lang
    i18n.setLocaleMessage(lang, Languages[lang])
    document.querySelector('html').setAttribute('lang', lang)
    return i18n
}

export default {
    // props: {
    //   customI18n: {
    //     type: Object,
    //     default: () => ({})
    //   }
    // },
    methods: {
        /**
         * This is a wrapper for the normal vue-i18n $t function that allows our components to support i18n
         * without requiring it (without it they should fallback to English)
         * @param {String} str the key to translate
         */
        t(str) {
            // use `$te` and `$t
            const libString = i18n.t(str);
            return this.$t && this.$te
                ? this.$te(str)
                    ? this.$t(str)
                    : libString
                : libString
                    ? libString
                    : str;
        }
    },
    // this will apply when user has initted their own VueI18n
    i18n: Languages
};
