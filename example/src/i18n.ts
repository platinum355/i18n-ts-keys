import Template from 'assets/locales/en/Template.json';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

const resources = {
    en: {
        Template,
    },
};

void i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    interpolation: {
        escapeValue: false,
    },
    lng: 'en',
    resources,
});

export {i18n};
