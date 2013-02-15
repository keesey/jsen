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
            "?:": function (cond, x, y) {
                return cond ? x : y;
            },
            "isFinite": isFinite,
            "isNaN": isNaN,
            "Array": Array,
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
test("ECMA-262: Basic declarations", function () {
    var solver = jsen.solver();
    jsen.ecma262.decl(solver);
    solver.decl('test', {
        "x": [
            "http://ecma-international.org/ecma-262/5.1:+", 
            1, 
            2
        ],
        "y": [
            "http://ecma-international.org/ecma-262/5.1:Math.sin", 
            [
                "http://ecma-international.org/ecma-262/5.1:/", 
                "http://ecma-international.org/ecma-262/5.1:Math.PI", 
                2
            ]
        ],
        "z": [
            "http://ecma-international.org/ecma-262/5.1:Array", 
            4, 
            5, 
            6
        ]
    });
    deepEqual(solver.eval('test'), {
        "x": 3,
        "y": 1,
        "z": [
            4, 
            5, 
            6
        ]
    });
});
test("ECMA-262: Referenced namespace", function () {
    var solver = jsen.solver();
    jsen.ecma262.decl(solver);
    solver.decl('test', {
        "js": "http://ecma-international.org/ecma-262/5.1:",
        "x": [
            "js:+", 
            1, 
            2
        ],
        "y": [
            "js:Math.sin", 
            [
                "js:/", 
                "js:Math.PI", 
                2
            ]
        ],
        "z": [
            "js:Array", 
            4, 
            5, 
            6
        ]
    });
    deepEqual(solver.eval('test'), {
        "x": 3,
        "y": 1,
        "z": [
            4, 
            5, 
            6
        ]
    });
});
test("ECMA-262: Referenced namespace and own identifiers", function () {
    var solver = jsen.solver();
    jsen.ecma262.decl(solver);
    solver.decl('test', {
        "pi": "js:Math.PI",
        "tau": [
            "js:*", 
            "pi", 
            2
        ],
        "js": "http://ecma-international.org/ecma-262/5.1:"
    });
    deepEqual(solver.eval('test'), {
        "pi": Math.PI,
        "tau": Math.PI * 2
    });
});
test("ECMA-262: Literals", function () {
    var solver = jsen.solver();
    jsen.ecma262.decl(solver);
    solver.decl('test', {
        "js": "http://ecma-international.org/ecma-262/5.1:",
        "a": "js:undefined",
        "b": "js:NaN",
        "c": "js:Infinity"
    });
    strictEqual(solver.eval('test', 'a'), undefined);
    ok(isNaN(solver.eval('test', 'b')));
    strictEqual(solver.eval('test', 'c'), Infinity);
});
test("ECMA-262: Accessors", function () {
    var solver = jsen.solver();
    jsen.ecma262.decl(solver);
    solver.decl('test', {
        "js": "http://ecma-international.org/ecma-262/5.1:",
        "a": [
            "js:Array", 
            1, 
            3, 
            5, 
            7
        ],
        "b": [
            "js:[]", 
            'a', 
            2
        ]
    });
    strictEqual(solver.eval('test', 'b'), 5);
});
test("ECMA-262: Operators", function () {
    var solver = jsen.solver();
    jsen.ecma262.decl(solver);
    solver.decl('test', {
        "js": "http://ecma-international.org/ecma-262/5.1:",
        "a": [
            "js:void", 
            88
        ],
        "b": [
            "js:+", 
            -1
        ],
        "c": [
            "js:+", 
            2, 
            -1
        ],
        "d": [
            "js:+", 
            2, 
            -1, 
            10
        ],
        "e": [
            "js:-", 
            -1
        ],
        "f": [
            "js:-", 
            2, 
            -1
        ],
        "g": [
            "js:-", 
            2, 
            -1, 
            10
        ],
        "h": [
            "js:~", 
            7
        ],
        "i": [
            "js:!", 
            true
        ]
    });
    deepEqual(solver.eval('test'), {
        "a": undefined,
        "b": -1,
        "c": 1,
        "d": 11,
        "e": 1,
        "f": 3,
        "g": -7,
        "h": -8,
        "i": false
    });
});
