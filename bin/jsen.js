Array.isArray || (Array.isArray = function (a) {
    return '' + a !== a && {
    }.toString.call(a) === '[object Array]';
});
var jsen;
(function (jsen) {
    function isNamespaceRef(expr) {
        return (typeof expr === 'string') && /[^\\]:$/.test(expr);
    }
    function expandNamespaceRefs(expr, nsRefHolder) {
        if(typeof expr === "string") {
            var parts = splitIdentifier(expr);
            if(parts.length >= 2) {
                var n_1 = parts.length - 1, uri = parts.slice(0, n_1).join(':'), uriExpr = nsRefHolder[uri];
                if(isNamespaceRef(uriExpr)) {
                    return uriExpr + parts[n_1].replace(':', '\\:');
                }
            }
        } else {
            if(Array.isArray(expr)) {
                var n = (expr).length, i = 0, a = new Array(n);
                for(; i < n; ++i) {
                    a[i] = expandNamespaceRefs(expr[i], nsRefHolder);
                }
                return a;
            }
        }
        return expr;
    }
    function splitIdentifier(identifier) {
        var result = [], current = "";
        for(var i = 0, n = identifier.length; i < n; ++i) {
            var c = identifier.charAt(i);
            if(c === '\\') {
                if(i < n - 1 && identifier.charAt(i + 1) === ':') {
                    current += ':';
                    i++;
                } else {
                    current += '\\';
                }
            } else {
                if(c === ':') {
                    result.push(current);
                    current = "";
                } else {
                    current += c;
                }
            }
        }
        result.push(current);
        return result;
    }
    function trickleNamespaceRefs(namespaces, ns) {
        var refs = {
        }, hasRefs = false, uri;
        for(uri in namespaces) {
            var expr = namespaces[uri];
            if(isNamespaceRef(expr)) {
                refs[uri] = expr;
                hasRefs = true;
            }
        }
        if(!hasRefs) {
            return ns;
        }
        var ns2 = {
        }, localName;
        for(localName in refs) {
            ns2[localName] = refs[localName];
        }
        for(localName in ns) {
            ns2[localName] = ns[localName];
        }
        return ns2;
    }
    var SolverImpl = (function () {
        function SolverImpl() {
            this._expr = {
            };
            this._maps = {
            };
            this._stack = {
            };
        }
        SolverImpl.prototype._evalExpr = function (uri, expr) {
            if(typeof expr === "string") {
                return this._evalExprString(uri, expr);
            }
            if(Array.isArray(expr)) {
                return this._evalExprArray(uri, expr);
            }
            return expr;
        };
        SolverImpl.prototype._evalExprArray = function (uri, expr) {
            var n = expr.length;
            if(n < 1) {
                try  {
                    throw new Error('Invalid expression: "' + JSON.stringify(expr) + '".');
                } catch (e) {
                    throw new Error('Invalid expression: [' + expr.join(", ") + '].');
                }
            }
            var op = this._evalExpr(uri, String(expr[0]));
            if(typeof op !== "function") {
                throw new Error('Does not refer to a function: "' + expr[0] + '".');
            }
            var args = [];
            for(var i = 1; i < n; ++i) {
                args.push(this._evalExpr(uri, expr[i]));
            }
            return op.apply(null, args);
        };
        SolverImpl.prototype._evalExprString = function (uri, expr) {
            var parts = splitIdentifier(expr), n = parts.length;
            if(n < 2) {
                if(uri === undefined) {
                    throw new Error("Cannot use local identifiers when there is no URI.");
                }
                return this.eval(uri, parts.join(":"));
            }
            return this.eval(parts.slice(0, n - 1).join(':'), parts[n - 1]);
        };
        SolverImpl.prototype._nsEval = function (uri) {
            if(!this._eval) {
                this._eval = {
                };
            } else {
                var ns = this._eval[uri];
                if(ns) {
                    return ns;
                }
            }
            return this._eval[uri] = {
            };
        };
        SolverImpl.prototype._nsExpr = function (uri) {
            var ns = this._expr[uri];
            if(ns) {
                return ns;
            }
            return this._expr[uri] = {
            };
        };
        SolverImpl.prototype.decl = function (a, b, expr) {
            if (typeof a === "undefined") { a = null; }
            if (typeof b === "undefined") { b = null; }
            if (typeof expr === "undefined") { expr = null; }
            var uri, uri2, localName, expr, expr2;
            this._eval = null;
            if(typeof a === "string") {
                if(typeof b === "string") {
                    this._nsExpr(a)[b] = expr;
                } else {
                    if(typeof b === 'function') {
                        this._maps[a] = b;
                    } else {
                        var ns = this._nsExpr(a);
                        for(localName in b) {
                            expr = b[localName];
                            if(!isNamespaceRef(expr)) {
                                ns[localName] = expandNamespaceRefs(expr, b);
                            }
                        }
                    }
                }
            } else {
                for(uri in a) {
                    expr = a[uri];
                    if(!isNamespaceRef(expr)) {
                        this.decl(uri, trickleNamespaceRefs(a, expr));
                    }
                }
            }
            return this;
        };
        SolverImpl.prototype.eval = function (uri, localName) {
            if (typeof uri === "undefined") { uri = null; }
            if (typeof localName === "undefined") { localName = null; }
            if(typeof uri === "string") {
                var sourceNS = this._nsEval(uri);
                if(typeof localName === "string") {
                    if(sourceNS.hasOwnProperty(localName)) {
                        return sourceNS[localName];
                    }
                    var qName = uri + ':' + localName, value;
                    if(this._stack[qName] === true) {
                        throw new Error('Expression "' + qName + '" has a circular definition.');
                    }
                    this._stack[qName] = true;
                    try  {
                        var nsExpr = this._nsExpr(uri);
                        if(!nsExpr.hasOwnProperty(localName) && typeof this._maps[uri] === 'function') {
                            value = this._maps[uri](localName);
                        } else {
                            value = this._evalExpr(uri, nsExpr[localName]);
                        }
                    }finally {
                        delete this._stack[qName];
                    }
                    return sourceNS[localName] = value;
                }
                var resultNS = {
                }, sourceExprNS = this._nsExpr(uri);
                for(localName in sourceExprNS) {
                    resultNS[localName] = this.eval(uri, localName);
                }
                return resultNS;
            }
            var resultSpaces = {
            };
            for(uri in this._expr) {
                resultSpaces[uri] = this.eval(uri);
            }
            return resultSpaces;
        };
        SolverImpl.prototype.evalExpr = function (expression) {
            return this._evalExpr(undefined, expression);
        };
        return SolverImpl;
    })();
    jsen.SolverImpl = SolverImpl;    
    var _solver = new SolverImpl();
    function decl(a, b, expr) {
        if (typeof b === "undefined") { b = null; }
        if (typeof expr === "undefined") { expr = null; }
        return _solver.decl(a, b, expr);
    }
    jsen.decl = decl;
    function eval(uri, localName) {
        if (typeof uri === "undefined") { uri = null; }
        if (typeof localName === "undefined") { localName = null; }
        return _solver.eval(uri, localName);
    }
    jsen.eval = eval;
    function evalExpr(expression) {
        return _solver.evalExpr(expression);
    }
    jsen.evalExpr = evalExpr;
    function solver() {
        return new SolverImpl();
    }
    jsen.solver = solver;
})(jsen || (jsen = {}));
