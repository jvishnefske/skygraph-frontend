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
        pi: 'Math.PI',
        infinity: 'Infinity',
        oo: 'Infinity', // 'oo' is also used for infinity in MathLex
        true: 'true',
        false: 'false'
    };

    const token = tree[0]; // The type of the current node (e.g., 'Plus', 'Variable', 'Function').

    switch (token) {
        case 'Empty':
            return '0'; // Represents an empty expression, default to 0 or an empty string
        case 'EmptySet':
            return 'new Set()'; // Represents an empty set

        // Arithmetic Operations
        case 'Plus':
            return `${treeToJS(tree[1])} + ${treeToJS(tree[2])}`;
        case 'Minus':
            return `${treeToJS(tree[1])} - ${treeToJS(tree[2])}`;
        case 'Times':
            return `${treeToJS(tree[1])} * ${treeToJS(tree[2])}`;
        case 'Divide':
            // tree[3] indicates if it's a fraction (true) or inline division (false)
            return `(${treeToJS(tree[1])}) / (${treeToJS(tree[2])})`;
        case 'Modulus':
            return `(${treeToJS(tree[1])}) % (${treeToJS(tree[2])})`;
        case 'Exponent':
            return `Math.pow(${treeToJS(tree[1])}, ${treeToJS(tree[2])})`;
        case 'Positive':
            return `+${treeToJS(tree[1])}`;
        case 'Negative':
            return `-${treeToJS(tree[1])}`;
        case 'PlusMinus':
            // Represents a value that can be either sum or difference.
            // This is ambiguous for a single JS expression. Returning the sum for now.
            // A more robust solution would return an array or a custom object.
            return `(${treeToJS(tree[1])} + ${treeToJS(tree[2])})`;
        case 'MinusPlus':
            // Similar to PlusMinus, returning the difference.
            return `(${treeToJS(tree[1])} - ${treeToJS(tree[2])})`;
        case 'Ratio':
            return `(${treeToJS(tree[1])}) / (${treeToJS(tree[2])})`; // Treat ratio as division

        // Literals, Variables, Constants
        case 'Literal':
            return String(tree[2]);
        case 'Variable':
            const varName = tree[1];
            if (contains(specialVars, varName)) {
                return specialVars[varName];
            } else if (!allForbiddenWords.includes(varName)) {
                if (!collectedFunctionVars.includes(varName)) {
                    collectedFunctionVars.push(varName);
                }
                return varName;
            } else {
                console.warn(`Forbidden variable name encountered: ${varName}`);
                return `/*forbidden_var:${varName}*/`;
            }
        case 'Constant':
            const constName = tree[1].toLowerCase();
            if (contains(specialVars, constName)) {
                return specialVars[constName];
            } else {
                // For other mathematical constants like 'gamma', 'tau', or set notations like 'C', 'R', 'Z', etc.
                // These don't have direct JS equivalents and might need custom objects or be treated as variables.
                console.warn(`Unsupported constant: ${tree[1]}`);
                return `/*unsupported_constant:${tree[1]}*/`;
            }

        // Grouping
        case 'Parentheses':
            return `(${treeToJS(tree[1])})`;
        case 'AbsVal':
            return `Math.abs(${treeToJS(tree[1])})`;
        case 'Norm':
            return `/* norm(${treeToJS(tree[1])}) */`; // Requires vector/matrix library

        // Logical Operations
        case 'Equal':
            return `(${treeToJS(tree[1])} === ${treeToJS(tree[2])})`;
        case 'NotEqual':
            return `(${treeToJS(tree[1])} !== ${treeToJS(tree[2])})`;
        case 'Less':
            return `(${treeToJS(tree[1])} < ${treeToJS(tree[2])})`;
        case 'LessEqual':
            return `(${treeToJS(tree[1])} <= ${treeToJS(tree[2])})`;
        case 'Greater':
            return `(${treeToJS(tree[1])} > ${treeToJS(tree[2])})`;
        case 'GreaterEqual':
            return `(${treeToJS(tree[1])} >= ${treeToJS(tree[2])})`;
        case 'And':
            return `(${treeToJS(tree[1])} && ${treeToJS(tree[2])})`;
        case 'Or':
            return `(${treeToJS(tree[1])} || ${treeToJS(tree[2])})`;
        case 'Not':
            return `!(${treeToJS(tree[1])})`;
        case 'Iff': // If and only if (logical equivalence)
            return `((${treeToJS(tree[1])} && ${treeToJS(tree[2])}) || (!${treeToJS(tree[1])} && !${treeToJS(tree[2])}))`;
        case 'Implies': // Implication (A -> B is !A || B)
            // tree[3] indicates direction, but for JS, A -> B is always !A || B
            return `(!(${treeToJS(tree[1])}) || (${treeToJS(tree[2])}))`;
        case 'Xor': // Exclusive OR
            return `((${treeToJS(tree[1])} || ${treeToJS(tree[2])}) && !(${treeToJS(tree[1])} && ${treeToJS(tree[2])}))`;
        case 'Equivalent':
            return `(${treeToJS(tree[1])} === ${treeToJS(tree[2])})`;
        case 'NotEquivalent':
            return `(${treeToJS(tree[1])} !== ${treeToJS(tree[2])})`;

        // Relational (non-equality)
        case 'RatioEqual':
            return `/* ratio_equal(${treeToJS(tree[1])}, ${treeToJS(tree[2])}) */`;
        case 'Congruent':
            return `/* congruent(${treeToJS(tree[1])}, ${treeToJS(tree[2])}) */`;
        case 'Similar':
            return `/* similar(${treeToJS(tree[1])}, ${treeToJS(tree[2])}) */`;
        case 'Parallel':
            return `/* parallel(${treeToJS(tree[1])}, ${treeToJS(tree[2])}) */`;
        case 'Perpendicular':
            return `/* perpendicular(${treeToJS(tree[1])}, ${treeToJS(tree[2])}) */`;
        case 'Divides':
            return `((${treeToJS(tree[2])}) % (${treeToJS(tree[1])}) === 0)`;
        case 'NotDivides':
            return `((${treeToJS(tree[2])}) % (${treeToJS(tree[1])}) !== 0)`;

        // Set Operations
        case 'Union':
            return `/* union(${treeToJS(tree[1])}, ${treeToJS(tree[2])}) */`;
        case 'Intersection':
            return `/* intersection(${treeToJS(tree[1])}, ${treeToJS(tree[2])}) */`;
        case 'SetDiff':
            return `/* setDifference(${treeToJS(tree[1])}, ${treeToJS(tree[2])}) */`;
        case 'Subset':
            return `/* isSubset(${treeToJS(tree[1])}, ${treeToJS(tree[2])}) */`;
        case 'Superset':
            return `/* isSuperset(${treeToJS(tree[1])}, ${treeToJS(tree[2])}) */`;
        case 'ProperSubset':
            return `/* isProperSubset(${treeToJS(tree[1])}, ${treeToJS(tree[2])}) */`;
        case 'ProperSuperset':
            return `/* isProperSuperset(${treeToJS(tree[1])}, ${treeToJS(tree[2])}) */`;
        case 'Inclusion': // Element in set
            return `/* ${treeToJS(tree[2])}.has(${treeToJS(tree[1])}) */`;
        case 'Set':
            const setElements = tree[1].map(item => treeToJS(item)).join(', ');
            return `new Set([${setElements}])`;
        case 'List': // Represent as a JS array
            const listElements = tree[1].map(item => treeToJS(item)).join(', ');
            return `[${listElements}]`;
        case 'SetBuilder': // { x : P(x) }
            // This is complex and requires a filter/map operation over a domain.
            return `/* setBuilder(${treeToJS(tree[1])}, ${treeToJS(tree[2])}) */`;
        case 'Range':
            // tree[1] is start inclusive, tree[4] is end inclusive
            // tree[2] is start value, tree[3] is end value
            // This is a conceptual range, not a direct JS array.
            return `/* range(${treeToJS(tree[2])}, ${treeToJS(tree[3])}, ${tree[1] ? 'inclusive_start' : 'exclusive_start'}, ${tree[4] ? 'inclusive_end' : 'exclusive_end'}) */`;

        // Vector/Matrix Operations
        case 'Vector':
            const vectorElements = tree[1].map(item => treeToJS(item)).join(', ');
            return `[${vectorElements}]`; // Simple array for now, could be a custom Vector class
        case 'DotProduct':
            return `/* dotProduct(${treeToJS(tree[1])}, ${treeToJS(tree[2])}) */`;
        case 'CrossProduct':
            return `/* crossProduct(${treeToJS(tree[1])}, ${treeToJS(tree[2])}) */`;
        case 'WedgeProduct':
            return `/* wedgeProduct(${treeToJS(tree[1])}, ${treeToJS(tree[2])}) */`;
        case 'TensorProduct':
            return `/* tensorProduct(${treeToJS(tree[1])}, ${treeToJS(tree[2])}) */`;
        case 'Vectorizer':
            return `/* vectorizer(${treeToJS(tree[1])}) */`;
        case 'UnitVectorizer':
            return `/* unitVectorizer(${treeToJS(tree[1])}) */`;

        // Calculus and Special Functions/Operators
        case 'Factorial':
            return `/* factorial(${treeToJS(tree[1])}) */`; // Requires a factorial function
        case 'Prime':
            return `/* prime(${treeToJS(tree[1])}) */`; // Placeholder for derivative notation (f')
        case 'DotDiff':
            // This represents derivatives with respect to time (e.g., x_dot, x_double_dot)
            // The MathLex parser handles multiple dots by nesting 'DotDiff' nodes.
            let dotCount = 0;
            let current = tree;
            while (current[0] === 'DotDiff') {
                dotCount++;
                current = current[1];
            }
            return `/* ${dotCount}-dot_derivative(${treeToJS(current)}) */`;
        case 'Partial':
            return `/* partial(${treeToJS(tree[1])}) */`;
        case 'Differential':
            return `/* differential(${treeToJS(tree[1])}) */`;
        case 'Change':
            return `/* change(${treeToJS(tree[1])}) */`;
        case 'Gradient':
            return `/* gradient(${treeToJS(tree[1])}) */`;
        case 'Divergence':
            return `/* divergence(${treeToJS(tree[1])}) */`;
        case 'Curl':
            return `/* curl(${treeToJS(tree[1])}) */`;
        case 'Superscript':
            // This is often used for exponents, but can also be for other notations.
            // If it's a number, it's likely an exponent. Otherwise, it's a notation.
            // For now, treat as Math.pow if the superscript is a number, otherwise a placeholder.
            const base = treeToJS(tree[1]);
            const superscript = treeToJS(tree[2]);
            if (!isNaN(parseFloat(superscript)) && isFinite(superscript)) {
                return `Math.pow(${base}, ${superscript})`;
            }
            return `/* superscript(${base}, ${superscript}) */`;
        case 'Subscript':
            // Subscripts usually denote elements of a sequence/array or specific variables.
            // This is highly context-dependent. Treat as array access if base is an array/list,
            // otherwise as a composite variable name.
            const subBase = treeToJS(tree[1]);
            const subIndex = treeToJS(tree[2]);
            return `/* subscript(${subBase}, ${subIndex}) */`; // e.g., `${subBase}[${subIndex}]` if `subBase` is an array

        // Quantifiers
        case 'Forall':
            return `/* forall(${treeToJS(tree[1])}, ${treeToJS(tree[2])}) */`;
        case 'Exists':
            return `/* exists(${treeToJS(tree[1])}, ${treeToJS(tree[2])}) */`;
        case 'Unique':
            return `/* unique(${treeToJS(tree[1])}, ${treeToJS(tree[2])}) */`;

        // Function Calls (general and specific MathLex functions)
        case 'Function':
            const funcNameNode = tree[1];
            const args = tree[2];

            if (funcNameNode[0] !== 'Variable') {
                console.warn('Expected function name to be a variable, but got:', funcNameNode);
                return `/* invalid_function_name */`;
            }
            const funcName = funcNameNode[1];
            const jsArgs = args.map(argTree => treeToJS(argTree));

            switch (funcName) {
                // Standard Math functions
                case 'sin': case 'cos': case 'tan':
                case 'asin': case 'acos': case 'atan':
                case 'sinh': case 'cosh': case 'tanh':
                case 'log': // Math.log is natural log (ln)
                case 'exp': // Math.exp is e^x
                case 'sqrt':
                case 'abs':
                case 'floor':
                case 'ceil':
                    return `Math.${funcName}(${jsArgs.join(',')})`;
                case 'ln': // Natural logarithm
                    return `Math.log(${jsArgs[0]})`;
                case 'log10': // Base 10 logarithm
                    return `Math.log10(${jsArgs[0]})`;
                case 'log2': // Base 2 logarithm
                    return `Math.log2(${jsArgs[0]})`;
                case 'csc': case 'sec': case 'cot':
                case 'acsc': case 'asec': case 'acot':
                case 'csch': case 'sech': case 'coth':
                case 'acsch': case 'asech': case 'acoth':
                    // These are not directly in Math, need to implement via sin/cos/tan
                    return `/* ${funcName}(${jsArgs.join(',')}) */`;
                case 'root': // root(x, n) -> Math.pow(x, 1/n)
                    if (jsArgs.length === 2) {
                        return `Math.pow(${jsArgs[0]}, 1/${jsArgs[1]})`;
                    }
                    console.warn(`Invalid arguments for root function: ${jsArgs.length}`);
                    return `/* root(${jsArgs.join(',')}) */`;

                // Aggregation functions (sum, prod, big union, big intersect)
                case 'sum': case 'prod': case 'Union': case 'Intersect':
                    // These require iterating over a range, which is complex in simple JS.
                    // The arguments structure for these is complex (e.g., [expression, variable, lower_bound, upper_bound])
                    return `/* ${funcName}(${jsArgs.join(',')}) */`;
                case 'lim': case 'limit':
                    // Arguments: [expression, variable, limit_point]
                    return `/* limit(${jsArgs.join(',')}) */`;

                // Calculus operators (often require symbolic libraries or specific numerical methods)
                case 'int': case 'integral':
                    // Arguments: [integrand, variable, lower_bound, upper_bound]
                    return `/* integral(${jsArgs.join(',')}) */`;
                case 'diff': // Differential, arguments: [expression, variable]
                    return `/* diff(${jsArgs.join(',')}) */`;
                case 'pdiff': // Partial differential, arguments: [expression, variable]
                    return `/* pdiff(${jsArgs.join(',')}) */`;
                case 'grad': case 'div': case 'curl':
                    return `/* ${funcName}(${jsArgs.join(',')}) */`;

                // Combinatorics
                case 'combination': // C(n, k)
                case 'comb':
                    return `/* combination(${jsArgs.join(',')}) */`;
                case 'perm': // P(n, k)
                    return `/* permutation(${jsArgs.join(',')}) */`;
                case 'choose': // Alias for combination
                    return `/* choose(${jsArgs.join(',')}) */`;

                // Special functions
                case 'Gamma':
                    return `/* Gamma(${jsArgs.join(',')}) */`; // Requires a Gamma function implementation

                default:
                    // For custom functions or unrecognized ones, treat as direct call
                    return `${funcName}(${jsArgs.join(',')})`;
            }

        // Quantum Mechanics Notation
        case 'Bra':
            return `/* bra(${treeToJS(tree[1])}) */`;
        case 'Ket':
            return `/* ket(${treeToJS(tree[1])}) */`;
        case 'BraKet':
            return `/* braKet(${treeToJS(tree[1])}, ${treeToJS(tree[2])}) */`;

        // Other complex structures
        case 'Integral':
            // This is the specific integral node from the grammar, distinct from 'int' function.
            // Structure: ['Integral', integrand, differential_variable, bounds_object]
            // bounds_object: {lo: lower_bound_tree, hi: upper_bound_tree}
            const integrand = treeToJS(tree[1]);
            const diffVar = treeToJS(tree[2]);
            const bounds = tree[3];
            const lowerBound = bounds.lo ? treeToJS(bounds.lo) : 'null';
            const upperBound = bounds.hi ? treeToJS(bounds.hi) : 'null';
            return `/* integral(${integrand}, ${diffVar}, ${lowerBound}, ${upperBound}) */`;

        case 'BigUnion':
            return `/* bigUnion(${treeToJS(tree[1])}, ${treeToJS(tree[2])}) */`;
        case 'BigIntersect':
            return `/* bigIntersect(${treeToJS(tree[1])}, ${treeToJS(tree[2])}) */`;

        default:
            // For any other unsupported token, return an error placeholder.
            console.warn(`Unhandled MathLex node type: ${token}`, tree);
            return `/* unsupported_token:${token} */`;
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
