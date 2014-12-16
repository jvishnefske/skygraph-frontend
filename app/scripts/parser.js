'use strict';
(function($, MathJax, undefined) {

$(document).ready(function() {
    var reservedWords = ['abstract', 'arguments', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class*', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'double', 'else', 'enum*', 'eval', 'export*', 'extends*', 'false', 'final', 'finally', 'float', 'for', 'function', 'goto', 'if', 'implements', 'import*', 'in', 'instanceof', 'int', 'interface', 'let', 'long', 'native', 'new', 'null', 'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'super*', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'true', 'try', 'typeof', 'var', 'void', 'volatile', 'while', 'with', 'yield'];
var forbiddenWords = ['Array', 'Date', 'eval', 'function', 'hasOwnProperty', 'Infinity', 'isFinite', 'isNaN', 'isPrototypeOf', 'length', 'Math', 'NaN', 'name', 'Number', 'Object', 'prototype', 'String', 'toString', 'undefined', 'valueOf'];
    reservedWords = reservedWords.concat(forbiddenWords);
    var chart;
    //get MathJax output object
    var mjDisplayBox, mjOutputBox;
    MathJax.Hub.Queue(function() {
        mjDisplayBox = MathJax.Hub.getAllJax('math-display')[0];
        mjOutputBox = MathJax.Hub.getAllJax('math-output')[0];
    });
    function contains(obj, key) {
        return typeof(obj[key]) !== 'undefined';
    }
    function plot(pts) {
        if (typeof chart === 'undefined') {
            var ctx = $('#myChart').get(0).getContext('2d');
            //chart = new Chart(ctx);
        }
        chart.PolarArea(pts);
    }
    function treeToJS(tree) {
        //for the javascript emitter a terminal string is a current
        //valid javascript string.
        //a nonterminal is anything else we still need to analyze
        // the stack contains type value pairs of the form [t,v]
        // where the type is a boolean true if terminal, false if nonterminal.

        var jsDebug = $('#js-debug');
        jsDebug.text('jsdebug:');
        var stack = [];
        stack.getTerminals = function(count) {
            var vars = [];
            for (var i = 0; i < count; ++i) {
                var temp = this.pop();
                if (temp[0] === false) throw new Error('Expected literal in parse tree.');
                vars.append(temp + '');
            }
            return vars;
        };
        var specialVars = {
            e: 'Math.E',
            pi: 'Math.PI'
        };
        var functions = {
            sin: ['Math.sin', 1],
            cos: ['Math.cos', 1],
            tan: ['Math.tan', 1],
            Parentheses: ['', 1],
            Exponent: ['Math.pow', 2]
        };
        var binaryOperators = {
            Plus: '+',
            Times: '*',
            Minus: '-'
        };
        var ignore = {
            Int: true,
            Float: true
        };
        var valid;
        var token = tree[0];
        if (token === 'Plus') {
            return String(treeToJS(tree[1])) + '+' + treeToJS(tree[2]);
        }else if (token === 'Exponent') {
            return 'Math.pow(' + treeToJS(tree[1]) + ',' + treeToJS(tree[2]) + ')';
        }else if (token === 'Times') {
            return treeToJS(tree[1]) + '*' + treeToJS(tree[2]);
        }else if (token === 'Literal') {
            return String(tree[2]);
        }else if (token === 'Minus') {

            return treeToJS(tree[1]) + '-' + treeToJS(tree[2]);
        }else if (token === 'Variable') {
            if (contains(specialVars, tree[1])) {
                return specialVars[tree[1]];
            }else if (!contains(reservedWords, tree)) {

            functionVars = functionVars.concat([tree[1]]);
                return tree[1];
            }

                else return '/*bad function*/';
        }else if (token === 'Parentheses') {
            return '(' + treeToJS(tree[1]) + ')';
        }else if (token === 'Function') {
            if (contains(functions, tree[1][1])) {
                var productionRule = functions[tree[1][1]];
                return productionRule[0] + '(' + tree[2].map(treeToJS).join() + ')';
                //return "# fun: "+JSON.stringify(tree)+"//"+JSON.stringify(productionRule)+"#";

            }
            else return '/* invalid function' + JSON.stringify(tree[1][1]) + '*/';

        }
        return ' /* invalid */ ';
    }
    var functionVars;
    // live output MathJax whenever a key is pressed
    $('#math-input').on('keyup', function(evt) {


        var math = $(this).val();
        var tree;
            $(this).css('color', 'black');
            if (math.length > 0) {
                try {
                    tree = MathLex.parse(math);
                    //var sageText = MathLex.render(tree,);
                    $('#debug-out').text(JSON.stringify(tree));
                    //$('.math-output')
                    //MathJax.Hub.Queue(['Text',mjDisplayBox,latex]);

                } catch (err) {
                    $(this).css('color', 'red');
                    $('#debug').text(err);
                    //window.alert(err);
                    throw err;
                }
            }else {
                MathJax.Hub.Queue(['Text', mjDisplayBox, '']);
                MathJax.Hub.Queue(['Text', mjOutputBox, '']);
            }
            functionVars = [];
            var strFunction = treeToJS(tree);
            //functionVars=functionVars.concat(5);
            eval('var myFunc=function(' + functionVars.join(',') + '){return ' + strFunction + '};');
            $('#js-out').text('js:' + String(myFunc));
                    //));
            //treeToJS(tree);
            //$("#js-out").text("yep, js works");
        });
    //plot([[1,2,3][1,0,1]]
    //
    /*
    plot(
            ta = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
};

            );
*/
            });
}(jQuery, MathJax));
