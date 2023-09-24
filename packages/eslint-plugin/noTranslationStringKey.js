// @ts-nocheck
const {isIdentifier, isLiteral, getIdentifierOrLiteralString, isTemplateLiteral, isConditionalExpression} = require('./utils');

// Запрещает передавать в i18n.t строковый ключ.
/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        messages: {
            stringArgForbidden: "String are not allowed for i18n.t argument. Use translations constant."
        },
        fixable: "code"
    },
    create(context) {
        return {
            CallExpression: function (node) {
                let isError = false, fix = null;

                if (node.callee.name === 't' && node.arguments.length) {
                    const argument = node.arguments[0];

                    if (isTemplateLiteral(argument)) {
                        const expression = argument.expressions[0];

                        if (isConditionalExpression(expression)) {
                            isError = true;
                            fix = function* fix(fixer) {
                                const consequent = getIdentifierOrLiteralString(expression.consequent);
                                const alternate = getIdentifierOrLiteralString(expression.alternate);
                                yield fixer.insertTextBefore(argument, 'Translations.');
                                yield fixer.replaceText(argument, argument.quasis[0].value.raw.replace(':', '.').slice(0, -1));
                                yield fixer.insertTextAfter(argument, `[${expression.test.name} ? ${consequent} : ${alternate}]`);
                            }
                        } else if (isIdentifier(expression)) {
                            isError = true;
                            fix = function* fix(fixer) {
                                yield fixer.insertTextBefore(argument, 'Translations.');
                                yield fixer.replaceText(argument, argument.quasis[0].value.raw.replace(':', '.').slice(0, -1));
                                yield fixer.insertTextAfter(argument, `[${expression.name}]`);
                            }
                        }
                    } else if (isLiteral(argument)) {
                        isError = true;
                        fix = function* fix(fixer) {
                            yield fixer.insertTextBefore(argument, 'Translations.');
                            yield fixer.replaceText(argument, argument.value.replace(':', '.'));
                        }
                    }
                }

                if (isError) {
                    context.report({
                        node: node.arguments[0],
                        messageId: "stringArgForbidden",
                        fix,
                    });
                }
            },
        };
    },
};