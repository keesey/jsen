Array.isArray || (Array.isArray = function (a) {
    return '' + a !== a && {
    }.toString.call(a) === '[object Array]';
});
var jsen;
(function (jsen) {
    function isNamespaceRef(expr) {
        return (typeof expr === 'string') && /:$/.test(expr);
    }
    function expandURIs(expr, nsRefHolder) {
        if(typeof expr === "string") {
            var parts = expr.split(':');
            if(parts.length >= 2) {
                var n_1 = parts.length - 1, uri = parts.slice(0, n_1).join(':'), uriExpr = nsRefHolder[uri];
                if(isNamespaceRef(uriExpr)) {
                    return uriExpr + parts[n_1];
                }
            }
        } else {
            if(Array.isArray(expr)) {
                var n = (expr).length, i = 0, a = new Array(n);
                for(; i < n; ++i) {
                    a[i] = expandURIs(expr[i], nsRefHolder);
                }
                return a;
            }
        }
        return expr;
    }
    var SolverImpl = (function () {
        function SolverImpl() {
            this._expr = {
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
            var parts = expr.split(':'), n = parts.length;
            if(n < 2) {
                return this.eval(uri, expr);
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
                    var ns = this._nsExpr(a);
                    for(localName in b) {
                        expr = b[localName];
                        if(!isNamespaceRef(expr)) {
                            ns[localName] = expandURIs(expr, b);
                        }
                    }
                }
            } else {
                for(uri in a) {
                    expr = a[uri];
                    if(isNamespaceRef(expr)) {
                        for(uri2 in a) {
                            expr2 = a[uri2];
                            if(!isNamespaceRef(expr2) && !expr2.hasOwnProperty(uri)) {
                                expr2[uri] = expr;
                            }
                        }
                    }
                }
                for(uri in a) {
                    expr = a[uri];
                    if(!isNamespaceRef(expr)) {
                        this.decl(uri, expr);
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
                        value = sourceNS[localName] = this._evalExpr(uri, this._nsExpr(uri)[localName]);
                    }finally {
                        delete this._stack[qName];
                    }
                    return value;
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
    function solver() {
        return new SolverImpl();
    }
    jsen.solver = solver;
})(jsen || (jsen = {}));
