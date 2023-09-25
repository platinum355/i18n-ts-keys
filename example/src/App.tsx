import React from 'react';
import {useTranslation} from 'react-i18next';
import {Translations} from './assets/locales';

const {
    Template: {Simple, Plurals, Context},
    Template,
} = Translations;

/** Example app. */
export const App = () => {
    const {t} = useTranslation();

    return (
        <div>
            <h1>{t(Template.Header)}</h1>
            <h4>{t(Simple.title)}</h4>
            <h2>{t(Plurals.header)}</h2>
            <ul>
                <li>{t(Plurals.example, {count: 1})}</li>
                <li>{t(Plurals.example, {count: 2})}</li>
                <li>{t(Plurals.example, {count: 5})}</li>
            </ul>
            <h2>{t(Context.header)}</h2>
            <ul>
                <li>{t(Context.contextExample, {context: 'first'})}</li>
                <li>{t(Context.contextExample, {context: 'second'})}</li>
            </ul>
        </div>
    );
};
