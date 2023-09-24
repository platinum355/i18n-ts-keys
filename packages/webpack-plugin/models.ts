/**
 * Properties of translations source.
 *
 * @param [name] Name of translations file.
 * @param [source] Source code.
 * @param [timestamp] Last modified time.
 */
export interface ITranslationNode {
    name?: string;
    source?: string;
    timestamp?: number;
}

export type TTimestamps = {[key: string]: number};
export type TTranslationsSource = {[key: string]: TTranslationsSource};
export type TTranslationsObject = {[key: string]: TTranslationsObject};
export type TTypesGeneratorInterfaces = {[key: string]: string};

/**
 * Input plugin options.
 *
 * @param inputPath Path to one of the directories with translations.
 * @param outputPath Path to output file (src/assets/locales/Translations.ts e.g.).
 */
export interface II18NTsKeysPluginOptions {
    inputPath: string;
    outputPath: string;
}
