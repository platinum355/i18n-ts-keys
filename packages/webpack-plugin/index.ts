import * as fs from 'fs';
import * as path from 'path';
import {defaultInterfaceName} from './consts';
import {TTimestamps, ITranslationNode, TTranslationsSource, TTranslationsObject, II18NTsKeysPluginOptions} from './models';
import {generateTypes} from './typesGenerator';
import {getTranslationFileName, isContainsSpecialSymbols, isEveryTranslationsEqual, isUpperCaseString, logError, logSuccess} from './utils';

class I18nTsKeysPlugin {
    inputPath: string;
    outputPath: string;
    timestamps: TTimestamps = {};
    parseError: boolean = false;

    constructor(options: II18NTsKeysPluginOptions) {
        if (!options?.inputPath) {
            throw new Error('I18nTsKeysPlugin: input path param not found');
        }
        if (!options?.outputPath) {
            throw new Error('I18nTsKeysPlugin: output path param not found');
        }

        this.inputPath = options.inputPath;
        this.outputPath = options.outputPath;
    }

    /** Returns a list of translations sources. */
    getTranslations = (): ITranslationNode[] => {
        const dir = fs.readdirSync(this.inputPath);
        return dir.map((fileName) => {
            const resolvedPath = path.resolve(`${this.inputPath}/${fileName}`);
            const translation: ITranslationNode = {};
            translation.name = fileName;
            translation.source = fs.readFileSync(resolvedPath, {
                encoding: 'utf8',
                flag: 'r',
            });
            translation.timestamp = fs.statSync(resolvedPath).mtime.getTime();
            return translation;
        });
    };

    /** Generates constant properties. */
    generateObjectProperties = (source: TTranslationsSource, prefix: string, withoutDot = false) => {
        let result = '';
        const usedFieldNames: {[key: string]: boolean} = {};

        for (const key in source) {
            let fieldName: string = key;
            let path = key;

            if (fieldName.includes('_') && !isUpperCaseString(fieldName)) {
                const chunks = fieldName.split('_');

                if (!isUpperCaseString(chunks[0])) {
                    // If the first chunk is camelCase, then the rest is context.
                    fieldName = chunks[0];
                } else {
                    const newChunks = [];
                    // The string refers to the field name until the case changes or the string is not a number.
                    for (const chunk of chunks) {
                        if (!isNaN(Number(chunk)) || !isUpperCaseString(chunk)) {
                            break;
                        }
                        newChunks.push(chunk);
                    }
                    fieldName = newChunks.join('_');
                }

                path = fieldName;
            }

            // Necessary to avoid repeated generation of strings with context.
            if (usedFieldNames[fieldName]) continue;
            usedFieldNames[fieldName] = true;

            if (isContainsSpecialSymbols(fieldName)) {
                fieldName = `['${fieldName}']`;
            }

            const newPrefix = `${prefix}${!withoutDot ? '.' : ''}${path}`;

            if (typeof source[key] === 'object') {
                result += `${fieldName}: {${this.generateObjectProperties(source[key], newPrefix)}},`;
            } else {
                result += `${fieldName}: '${newPrefix}',`;
            }
        }

        return result;
    };

    /** Generates properties for translations source. */
    generateTranslation = (translation: ITranslationNode): string => {
        const filename = getTranslationFileName(translation);
        this.timestamps[filename] = translation.timestamp;

        try {
            return `${filename}: {${this.generateObjectProperties(
                JSON.parse(translation.source) as TTranslationsSource,
                `${filename}:`,
                true
            )}}`;
        } catch (e) {
            this.parseError = true;
            logError(`Failed to parse '${filename}'`);

            return `_GENERATION_ERROR_: '${e}'`;
        }
    };

    apply(compiler) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        compiler.hooks.thisCompilation.tap('I18nTsKeysPlugin', (_compilation) => {
            try {
                this.parseError = false;
                const translations: ITranslationNode[] = this.getTranslations();

                // If the files have not changed, we do nothing.
                if (isEveryTranslationsEqual(translations, this.timestamps)) return;

                const translationObjectString = `{${translations.map(this.generateTranslation).join(',')}}`;
                const parsedTranslationObject: TTranslationsObject = new Function(`return ${translationObjectString}`)();
                const types = generateTypes(parsedTranslationObject);
                const asset = `export const Translations: ${defaultInterfaceName} = ${translationObjectString};\n\n${types}`;

                fs.writeFileSync(this.outputPath, asset);
                !this.parseError && logSuccess('generation successful !');
            } catch (e) {
                logError(e as string);
            }
        });
    }
}

export default I18nTsKeysPlugin;
