import {defaultInterfaceName} from './consts';
import {TTranslationsObject, TTypesGeneratorInterfaces} from './models';

/** Capitalizes the first letter */
const upperFirstLetter = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);

const generateRecursively = (
    object: TTranslationsObject,
    interfaceName: string,
    interfaces: TTypesGeneratorInterfaces = {},
    isFirstLevel = true
) => {
    let props = '';
    for (const key in object) {
        const propName = key.includes('-') ? `['${key}']` : key;
        if (typeof object[key] !== 'object') {
            props += `\t${propName}: string;\n`;
        } else {
            let iName = upperFirstLetter(key);
            if (interfaces[iName] !== undefined) {
                iName += Object.keys(interfaces).length + 1;
            }
            interfaces[iName] = '';
            props += `\t${propName}: ${iName};\n`;

            generateRecursively(object[key], iName, interfaces, false);
        }
    }
    interfaces[interfaceName] = props;

    if (!isFirstLevel) return;
    return Object.keys(interfaces)
        .map((iName) => `interface ${iName} {\n${interfaces[iName]}}\n`)
        .join('\n');
};

/** Generates types for translations constant. */
export const generateTypes = (translationsObject: TTranslationsObject) => generateRecursively(translationsObject, defaultInterfaceName);
