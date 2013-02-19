Object.freeze || (Object.freeze = function (o) {
    return o;
});
var jsen;
(function (jsen) {
    (function (namesonnodes) {
        var ARGS_GTE_2 = 'This operation requires at least two arguments.';
        var CACHE = {
        };
        var EMPTYSET = Object.freeze({
            empty: true,
            map: Object.freeze({
            }),
            toString: STRING_FUNCTION,
            units: 0
        });
        var NAMESPACE = {
            'branch': function (x, y) {
                return diff(prcintersect(x), prcunion(y));
            },
            'clade': clade,
            'cladogen': cladogen,
            'crown': function (x, extant) {
                return clade(intersect(clade(x), extant));
            },
            'diff': op_multiple(diff),
            'emptyset': EMPTYSET,
            'eq': op_logic_multiple(eq),
            'intersect': intersect,
            'max': max,
            'min': min,
            'neq': op_logic_multiple(function (a, b) {
                return !eq(a, b);
            }),
            'prc': op_logic_multiple(prc),
            'prceq': op_logic_multiple(function (x, y) {
                return eq(x, y) || prc(x, y);
            }),
            'prcintersect': op_multiple(prcintersect),
            'prcunion': op_multiple(prcunion),
            'prsuperset': op_logic_multiple(function (x, y) {
                return prsubset(y, x);
            }),
            'prsubset': op_logic_multiple(prsubset),
            'superset': op_logic_multiple(function (x, y) {
                return subset(y, x);
            }),
            'subset': op_logic_multiple(subset),
            'suc': op_logic_multiple(suc),
            'suceq': op_logic_multiple(function (x, y) {
                return eq(x, y) || suc(x, y);
            }),
            'sucintersect': op_multiple(sucintersect),
            'sucunion': op_multiple(sucunion),
            'synprc': synprc,
            'total': total,
            'union': union,
            'unit': namesonnodes.unit
        };
        var STRING_FUNCTION = function () {
            return '[object jsen.namesonnodes.Taxic]';
        };
        namesonnodes.URI = "http://namesonnodes.org/ns/math/2013";
        function clade(x) {
            return cladogen(x) ? sucunion(x) : sucunion(max(prcintersect(x)));
        }
        function cladogen(x) {
            if(x.empty) {
                return false;
            }
            if(x.units === 1) {
                return true;
            }
            return !sucintersect(x).empty;
        }
        function create(units) {
            if (typeof units === "undefined") { units = null; }
            var map, unitCount, id;
            if(!units) {
                return EMPTYSET;
            }
            map = {
            };
            unitCount = 0;
            if(Array.isArray(units)) {
                for(var i = 0, n = (units).length; i < n; ++i) {
                    id = String(units[i]);
                    if(!map[id]) {
                        unitCount++;
                        map[id] = true;
                    }
                }
            } else {
                for(id in units) {
                    unitCount++;
                    map[id] = true;
                }
            }
            if(unitCount === 0) {
                return EMPTYSET;
            }
            return Object.freeze({
                empty: false,
                map: Object.freeze(map),
                toString: STRING_FUNCTION,
                units: unitCount
            });
        }
        function decl(solver, uri) {
            if(uri === null) {
                uri = namesonnodes.URI;
            }
            if(solver) {
                return solver.decl(uri, NAMESPACE);
            }
            return jsen.decl(uri, NAMESPACE);
        }
        namesonnodes.decl = decl;
        function diff(x, y) {
            if(x.empty || y.empty) {
                return x;
            }
            var map = {
            }, units = 0, id;
            for(id in x.map) {
                if(!y.map[id]) {
                    map[id] = true;
                    units++;
                }
            }
            if(units === 0) {
                return EMPTYSET;
            }
            return Object.freeze({
                empty: false,
                map: Object.freeze(map),
                toString: STRING_FUNCTION,
                units: units
            });
        }
        function eq(a, b) {
            if(a == b) {
                return true;
            }
            if(a.units !== b.units) {
                return false;
            }
            var id;
            for(id in a.map) {
                if(!b[id]) {
                    return false;
                }
            }
            return true;
        }
        function intersect() {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            var i = 1, n = args.length, map = {
            }, units = 0, id, arg;
            if(n < 2) {
                throw new Error(ARGS_GTE_2);
            }
            arg = args[0];
            if(arg.empty) {
                return EMPTYSET;
            }
            for(id in arg.map) {
                map[id] = true;
                units++;
            }
            for(; i < n; ++i) {
                if(args[i].empty) {
                    return EMPTYSET;
                }
            }
            for(i = 1; i < n; ++i) {
                arg = args[i];
                for(id in map) {
                    if(!arg.map[id]) {
                        units--;
                        delete map[id];
                        if(units === 0) {
                            return EMPTYSET;
                        }
                    }
                }
            }
            return Object.freeze({
                empty: false,
                map: Object.freeze(map),
                toString: STRING_FUNCTION,
                units: units
            });
        }
        function max(a) {
        }
        function min(a) {
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
        function prc(a, b) {
        }
        function prcintersect(a) {
        }
        function prcunion(a) {
        }
        function prsubset(a, b) {
        }
        function subset(a, b) {
        }
        function suc(a, b) {
        }
        function sucintersect(a) {
        }
        function sucunion(a) {
        }
        function synprc(apomorphic, representative) {
        }
        function total(x, extant) {
        }
        function union() {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            var i = 0, n = args.length, map = {
            }, units = 0, id;
            for(; i < n; ++i) {
                var arg = args[i];
                for(id in arg.map) {
                    if(!map[id]) {
                        units++;
                        map[id] = true;
                    }
                }
            }
            if(units === 0) {
                return EMPTYSET;
            }
            return Object.freeze({
                empty: false,
                map: Object.freeze(map),
                toString: STRING_FUNCTION,
                units: units
            });
        }
        function unit() {
            var id = String(Math.random()), map = {
            };
            map[id] = true;
            return Object.freeze({
                empty: false,
                map: Object.freeze(map),
                toString: STRING_FUNCTION,
                units: 1
            });
        }
        namesonnodes.unit = unit;
    })(jsen.namesonnodes || (jsen.namesonnodes = {}));
    var namesonnodes = jsen.namesonnodes;
})(jsen || (jsen = {}));
