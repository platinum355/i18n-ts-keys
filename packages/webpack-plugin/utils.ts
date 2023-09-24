import {ITranslationNode, TTimestamps} from './models';

/** Log success message. */
export const logSuccess = (text: string): void => {
    console.log('\x1b[32m', `\nI18nTsKeysPlugin: ${text}`, '\x1b[0m');
};
/** Log error message. */
export const logError = (text: string): void => {
    console.log('\x1b[31m', `\nI18nTsKeysPlugin error: ${text}`, '\x1b[0m');
};

/** Checks that the string is uppercase. */
export const isUpperCaseString = (str: string): boolean => str.split('').every((symbol) => symbol === symbol.toUpperCase());

/** Checks that the string includes special symbols or is a number. */
export const isContainsSpecialSymbols = (name: string): boolean => /[-]/.test(name) || !isNaN(Number(name));

/** Returns translations file name. */
export const getTranslationFileName = (translation: ITranslationNode): string => translation.name.match(/([^\\/]+)(?=\.\w+$)/g)[0];

/** Checks that files have changes. */
export const isEveryTranslationsEqual = (translations: ITranslationNode[], timestamps: TTimestamps): boolean =>
    translations.every((translation) => timestamps[getTranslationFileName(translation)] === translation.timestamp);
