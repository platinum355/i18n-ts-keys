const isIdentifier = (node) => node.type === 'Identifier';
const isLiteral = (node) => node.type === 'Literal';
const isTemplateLiteral = (node) => node.type === 'TemplateLiteral';
const isConditionalExpression = (node) => node.type === 'ConditionalExpression';

const getIdentifierOrLiteralString = (node) => (isIdentifier(node) ? node.name : `'${node.value}'`);

module.exports = {isIdentifier, isLiteral, isTemplateLiteral, isConditionalExpression, getIdentifierOrLiteralString};
