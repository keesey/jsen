var jsen;
(function (jsen) {
    (function (ecma262) {
        ecma262.URI = "http://ecma-international.org/ecma-262/5.1";
        var NAMESPACE = {
            "undefined": undefined,
            "NaN": NaN,
            "Infinity": Infinity,
            "[]": function (x, y) {
                return x[y];
            },
            "void": function (x) {
                return void x;
            },
            "+": op_any(function (x) {
                return +x;
            }, function (x, y) {
                return x + y;
            }),
            "-": op_any(function (x) {
                return -x;
            }, function (x, y) {
                return x - y;
            }),
            "~": function (x) {
                return ~x;
            },
            "!": function (x) {
                return !x;
            },
            "*": op_multiple(function (x, y) {
                return x * y;
            }),
            "/": op_multiple(function (x, y) {
                return x / y;
            }),
            "%": op_multiple(function (x, y) {
                return x % y;
            }),
            "<<": op_multiple(function (x, y) {
                return x << y;
            }),
            ">>": op_multiple(function (x, y) {
                return x >> y;
            }),
            ">>>": op_multiple(function (x, y) {
                return x >>> y;
            }),
            "<": op_logic_multiple(function (x, y) {
                return x < y;
            }),
            ">": op_logic_multiple(function (x, y) {
                return x > y;
            }),
            "<=": op_logic_multiple(function (x, y) {
                return x <= y;
            }),
            ">=": op_logic_multiple(function (x, y) {
                return x >= y;
            }),
            "in": function (x, y) {
                return x in y;
            },
            "==": op_logic_multiple(function (x, y) {
                return x == y;
            }),
            "!=": op_logic_multiple(function (x, y) {
                return x != y;
            }),
            "===": op_logic_multiple(function (x, y) {
                return x === y;
            }),
            "!==": op_logic_multiple(function (x, y) {
                return x !== y;
            }),
            "&": op_multiple(function (x, y) {
                return x & y;
            }),
            "^": op_multiple(function (x, y) {
                return x ^ y;
            }),
            "|": op_multiple(function (x, y) {
                return x | y;
            }),
            "&&": and,
            "||": or,
            "?\\:": function (cond, x, y) {
                return cond ? x : y;
            },
            "isFinite": isFinite,
            "isNaN": isNaN,
            "Array": op_array,
            "Boolean": Boolean,
            "Number": Number,
            "Math.E": Math.E,
            "Math.LN2": Math.LN2,
            "Math.LN10": Math.LN10,
            "Math.LOG2E": Math.LOG2E,
            "Math.LOG10E": Math.LOG10E,
            "Math.PI": Math.PI,
            "Math.SQRT1_2": Math.SQRT1_2,
            "Math.SQRT2": Math.SQRT2,
            "Math.abs": Math.abs,
            "Math.acos": Math.acos,
            "Math.asin": Math.asin,
            "Math.atan": Math.atan,
            "Math.atan2": Math.atan2,
            "Math.ceil": Math.ceil,
            "Math.cos": Math.cos,
            "Math.exp": Math.exp,
            "Math.floor": Math.floor,
            "Math.log": Math.log,
            "Math.max": Math.max,
            "Math.min": Math.min,
            "Math.pow": Math.pow,
            "Math.random": Math.random,
            "Math.round": Math.round,
            "Math.sin": Math.sin,
            "Math.sqrt": Math.sqrt,
            "Math.tan": Math.tan
        };
        var ARGS_GTE_1 = 'This operator requires at least one argument.';
        var ARGS_GTE_2 = 'This operator requires at least two arguments.';
        function and() {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            var n = args.length;
            if(n === 0) {
                throw new Error(ARGS_GTE_1);
            }
            for(var i = 0; i < n; ++i) {
                if(!args[i]) {
                    return false;
                }
            }
            return true;
        }
        function or() {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            var n = args.length;
            if(n === 0) {
                throw new Error(ARGS_GTE_1);
            }
            for(var i = 0; i < n; ++i) {
                if(args[i]) {
                    return true;
                }
            }
            return false;
        }
        function op_any(single, double) {
            return function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                var n = args.length;
                if(n === 0) {
                    throw new Error(ARGS_GTE_1);
                }
                if(n === 1) {
                    return single(args[0]);
                }
                var result = args[0];
                for(var i = 1; i < n; ++i) {
                    result = double(result, args[i]);
                }
                return result;
            }
        }
        function op_array() {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            var n = args.length;
            if(n === 1) {
                return [
                    args[0]
                ];
            }
            return Array.apply(null, args);
        }
        function op_logic_multiple(op) {
            return function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                var n = args.length;
                if(n < 2) {
                    throw new Error(ARGS_GTE_2);
                }
                for(var i = 1; i < n; ++i) {
                    if(!op(args[i - 1], args[i])) {
                        return false;
                    }
                }
                return true;
            }
        }
        function op_multiple(op) {
            return function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                var n = args.length;
                if(n < 2) {
                    throw new Error(ARGS_GTE_2);
                }
                var result = args[0];
                for(var i = 1; i < n; ++i) {
                    result = op(result, args[i]);
                }
                return result;
            }
        }
        function decl(solver, uri) {
            if (typeof solver === "undefined") { solver = null; }
            if (typeof uri === "undefined") { uri = null; }
            if(uri === null) {
                uri = ecma262.URI;
            }
            if(solver) {
                return solver.decl(uri, NAMESPACE);
            }
            return jsen.decl(uri, NAMESPACE);
        }
        ecma262.decl = decl;
    })(jsen.ecma262 || (jsen.ecma262 = {}));
    var ecma262 = jsen.ecma262;
})(jsen || (jsen = {}));
