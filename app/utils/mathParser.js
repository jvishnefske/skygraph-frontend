/**
 * @file mathParser.js
 * @description This module provides functionality to parse mathematical expressions
 *              using MathLex and convert them into executable JavaScript function strings.
 *              It replaces the core logic previously found in app/scripts/parser.js.
 */

// List of JavaScript reserved words and forbidden global names to prevent variable name clashes.
// These are used to validate variable names extracted from the math expression.
const reservedWords = [
    'abstract', 'arguments', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'double', 'else', 'enum', 'eval', 'export', 'extends', 'false', 'final', 'finally', 'float', 'for', 'function', 'goto', 'if', 'implements', 'import', 'in', 'instanceof', 'int', 'interface', 'let', 'long', 'native', 'new', 'null', 'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'true', 'try', 'typeof', 'var', 'void', 'volatile', 'while', 'with', 'yield'
];
const forbiddenWords = [
    'Array', 'Date', 'eval', 'function', 'hasOwnProperty', 'Infinity', 'isFinite', 'isNaN', 'isPrototypeOf', 'length', 'Math', 'NaN', 'name', 'Number', 'Object', 'prototype', 'String', 'toString', 'undefined', 'valueOf'
];
const allForbiddenWords = reservedWords.concat(forbiddenWords);

/**
 * Checks if an object contains a specific key.
 * @param {object} obj - The object to check.
 * @param {string} key - The key to look for.
 * @returns {boolean} True if the key exists in the object, false otherwise.
 */
function contains(obj, key) {
    return typeof(obj[key]) !== 'undefined';
}

// A temporary array to collect variable names encountered during tree traversal.
// It is reset for each call to parseMathExpression.
let collectedFunctionVars = [];

/**
 * Recursively converts a MathLex parse tree node into a JavaScript expression string.
 * This function handles basic arithmetic operations, literals, variables, parentheses,
 * and a limited set of mathematical functions.
 *
 * @param {Array} tree - A node from the MathLex parse tree (e.g., `['Plus', operand1, operand2]`).
 * @returns {string} The JavaScript equivalent of the parse tree node.
 */
function treeToJS(tree) {
    // Special variables that map to JavaScript's Math constants.
    const specialVars = {
        e: 'Math.E',
        pi: 'Math.PI'
    };

    // Mapping of MathLex function names to JavaScript Math methods.
    // The second element in the array indicates the number of arguments (not strictly used here, but good for context).
    const functions = {
        sin: ['Math.sin', 1],
        cos: ['Math.cos', 1],
        tan: ['Math.tan', 1],
        // Parentheses and Exponent are handled as special cases due to their syntax.
        // They are included here for completeness but processed directly in the switch.
        Parentheses: ['', 1],
        Exponent: ['Math.pow', 2]
    };

    const token = tree[0]; // The type of the current node (e.g., 'Plus', 'Variable', 'Function').

    switch (token) {
        case 'Plus':
            return `${treeToJS(tree[1])} + ${treeToJS(tree[2])}`;
        case 'Minus':
            // Handles binary subtraction. Unary negation is handled by 'Negative' token.
            return `${treeToJS(tree[1])} - ${treeToJS(tree[2])}`;
        case 'Times':
            return `${treeToJS(tree[1])} * ${treeToJS(tree[2])}`;
        case 'Divide':
            return `${treeToJS(tree[1])} / ${treeToJS(tree[2])}`;
        case 'Modulus':
            return `${treeToJS(tree[1])} % ${treeToJS(tree[2])}`;
        case 'Exponent':
            // Converts 'Exponent' (e.g., x^y) to Math.pow(x, y).
            return `Math.pow(${treeToJS(tree[1])}, ${treeToJS(tree[2])})`;
        case 'Literal':
            // Returns the literal value directly (e.g., numbers).
            return String(tree[2]);
        case 'Variable':
            const varName = tree[1];
            if (contains(specialVars, varName)) {
                // If it's a special variable like 'e' or 'pi', use its Math. constant.
                return specialVars[varName];
            } else if (!allForbiddenWords.includes(varName)) {
                // If it's a valid variable name (not a reserved/forbidden word),
                // add it to the list of collected function variables.
                if (!collectedFunctionVars.includes(varName)) {
                    collectedFunctionVars.push(varName);
                }
                return varName;
            } else {
                // If the variable name is forbidden, return an error placeholder.
                return `/*bad variable: ${varName}*/`;
            }
        case 'Parentheses':
            // Wraps the inner expression in parentheses.
            return `(${treeToJS(tree[1])})`;
        case 'Function':
            // Handles function calls (e.g., sin(x)).
            const funcName = tree[1][1]; // Extracts the function name (e.g., 'sin').
            if (functions[funcName]) {
                // If the function is explicitly mapped, use its JavaScript equivalent.
                const productionRule = functions[funcName];
                const args = tree[2].map(argTree => treeToJS(argTree)).join(', ');
                return `${productionRule[0]}(${args})`;
            } else {
                // For unsupported functions, return an error placeholder.
                return `/* unsupported function: ${funcName} */`;
            }
        case 'Negative':
            // Handles unary negation (e.g., -x).
            return `-${treeToJS(tree[1])}`;
        case 'Positive':
            // Handles unary positive (e.g., +x).
            return `+${treeToJS(tree[1])}`;
        // Basic comparison and logical operators (added for more robust parsing, though original was limited)
        case 'Equal':
            return `${treeToJS(tree[1])} === ${treeToJS(tree[2])}`;
        case 'NotEqual':
            return `${treeToJS(tree[1])} !== ${treeToJS(tree[2])}`;
        case 'Less':
            return `${treeToJS(tree[1])} < ${treeToJS(tree[2])}`;
        case 'LessEqual':
            return `${treeToJS(tree[1])} <= ${treeToJS(tree[2])}`;
        case 'Greater':
            return `${treeToJS(tree[1])} > ${treeToJS(tree[2])}`;
        case 'GreaterEqual':
            return `${treeToJS(tree[1])} >= ${treeToJS(tree[2])}`;
        case 'And':
            return `${treeToJS(tree[1])} && ${treeToJS(tree[2])}`;
        case 'Or':
            return `${treeToJS(tree[1])} || ${treeToJS(tree[2])}`;
        case 'Not':
            return `!${treeToJS(tree[1])}`;
        default:
            // For any other unsupported token, return an error placeholder.
            return `/* unsupported token: ${token} */`;
    }
}

/**
 * Parses a mathematical expression string using MathLex and converts it into a
 * JavaScript function string. It also identifies and returns the variables
 * present in the expression.
 *
 * @param {string} mathExpression - The mathematical expression string to parse.
 * @returns {{jsFunctionString: string, variables: string[], parseTree: Array}}
 *          An object containing:
 *          - `jsFunctionString`: The generated JavaScript function string (e.g., "function(x, y) { return Math.pow(x, y); }").
 *          - `variables`: An array of variable names found in the expression (e.g., ['x', 'y']).
 *          - `parseTree`: The raw parse tree generated by MathLex (useful for debugging).
 * @throws {Error} If MathLex encounters a parsing error.
 */
export function parseMathExpression(mathExpression) {
    collectedFunctionVars = []; // Reset collected variables for each new parse call.
    let tree;

    try {
        // MathLex is assumed to be globally available (e.g., loaded via a script tag).
        // If MathLex were an ES6 module, it would be imported here.
        tree = MathLex.parse(mathExpression);
    } catch (err) {
        throw new Error(`MathLex parsing error: ${err.message}`);
    }

    // Convert the MathLex parse tree into a JavaScript expression body.
    const jsBody = treeToJS(tree);

    // Sort the collected variables alphabetically for a consistent function signature.
    const sortedVars = collectedFunctionVars.sort();

    // Construct the full JavaScript function string.
    const jsFunctionString = `function(${sortedVars.join(', ')}) { return ${jsBody}; }`;

    return {
        jsFunctionString: jsFunctionString,
        variables: sortedVars,
        parseTree: tree // Include the parse tree for potential debugging or further processing.
    };
}
