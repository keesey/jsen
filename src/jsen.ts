///<reference path='./jsen.d.ts' />

// Polyfill.
Array.isArray || (Array.isArray = function(a)
	{
	    return '' + a !== a && {}.toString.call(a) === '[object Array]';
	});

module jsen
{
	function isNamespaceRef(expr)
	{
		return (typeof expr === 'string') && /:$/.test(expr);
	}

	function expandURIs(expr, nsExpr: Namespace)
	{
		if (typeof expr === "string")
		{
			var parts = expr.split(':');
			if (parts.length >= 2)
			{
				var n_1 = parts.length - 1,
					uri = parts.slice(0, n_1).join(':'),
					uriExpr = nsExpr[uri];
				if (isNamespaceRef(uriExpr))
				{
					return uriExpr + parts[n_1];
				}
			}
		}
		else if (Array.isArray(expr))
		{
			var n = (<any[]> expr).length,
				i = 0,
				a = new Array(n);
			for ( ; i < n; ++i)
			{
				a[i] = expandURIs(expr[i], nsExpr);
			}
			return a;
		}
		return expr;
	}

	export class SolverImpl
	{
		private _eval: Namespaces;
		private _expr: Namespaces = {};
		private _stack = {};
		private _evalExpr(uri: string, expr: any): any
		{
			if (typeof expr === "string")
			{
				return this._evalExprString(uri, <string> expr);
			}
			if (Array.isArray(expr))
			{
				return this._evalExprArray(uri, <any[]> expr);
			}
			return expr;
		}
		private _evalExprArray(uri: string, expr: any[]): any
		{
			var n = expr.length;
			if (n < 1)
			{
				try
				{
					throw new Error('Invalid expression: "' + JSON.stringify(expr) + '".');
				}
				catch (e)
				{
					throw new Error('Invalid expression: [' + expr.join(", ") + '].');
				}
			}
			var op: Function = this._evalExpr(uri, String(expr[0]));
			if (typeof op !== "function")
			{
				throw new Error('Does not refer to a function: "' + expr[0] + '".');
			}
			var args = [];
			for (var i = 1; i < n; ++i)
			{
				args.push(this._evalExpr(uri, expr[i]));
			}
			return op.apply(null, args);
		}
		private _evalExprString(uri: string, expr: string): any
		{
			var parts = expr.split(':'),
				n = parts.length;
			if (n < 2)
			{
				return this.eval(uri, expr);
			}
			return this.eval(parts.slice(0, n - 1).join(':'), parts[n - 1]);
		}
		private _nsEval(uri: string): Namespace
		{
			if (!this._eval)
			{
				this._eval = {};
			}
			else
			{
				var ns = this._eval[uri];
				if (ns)
				{
					return ns;
				}
			}
			return this._eval[uri] = {};
		}
		private _nsExpr(uri: string): Namespace
		{
			var ns = this._expr[uri];
			if (ns)
			{
				return ns;
			}
			return this._expr[uri] = {};
		}
		decl(a?: any = null, b?: any = null, expr?: any = null): Solver
		{
			var uri: string,
				localName: string;
			this._eval = null;
			if (typeof a === "string")
			{
				if (typeof b === "string")
				{
					this._nsExpr(<string> a)[b] = expr;
				}
				else 
				{
					var ns = this._nsExpr(<string> a);
					for (localName in b)
					{
						var expr = b[localName];
						if (!isNamespaceRef(expr))
						{
							ns[localName] = expandURIs(expr, b);
						}
					}
				}
			}
			else
			{
				for (uri in a)
				{
					this.decl(uri, a[uri]);
				}
			}
			return <Solver> this;
		}
		eval(uri?: string = null, localName?: string = null): any
		{
			if (typeof uri === "string")
			{
				var sourceNS: Namespace = this._nsEval(uri);
				if (typeof localName === "string")
				{
					if (sourceNS.hasOwnProperty(localName))
					{
						return sourceNS[localName];
					}
					var qName = uri + ':' + localName,
						value;
					if (this._stack[qName] === true)
					{
						throw new Error('Expression "' + qName + '" has a circular definition.');
					}
					this._stack[qName] = true;
					try
					{
						value = sourceNS[localName] = this._evalExpr(uri, this._nsExpr(uri)[localName]);
					}
					finally
					{
						delete this._stack[qName];
					}
					return value;
				}
				var resultNS: Namespace = {},
					sourceExprNS = this._nsExpr(uri);
				for (localName in sourceExprNS)
				{
					resultNS[localName] = this.eval(uri, localName);
				}
				return resultNS;
			}
			var resultSpaces: Namespaces = {};
			for (uri in this._expr)
			{
				resultSpaces[uri] = this.eval(uri);
			}
			return resultSpaces;
		}
		expr(uri?: string = null, localName?: string = null): any
		{
			if (typeof uri === "string")
			{
				var sourceNS = this._nsExpr(uri);
				if (typeof localName === "string")
				{
					return sourceNS[localName];
				}
				var resultNS: Namespace = {};
				for (localName in sourceNS)
				{
					resultNS[localName] = sourceNS[localName];
				}
				return resultNS;
			}
			var resultSpaces: Namespaces = {};
			for (uri in this._expr)
			{
				resultSpaces[uri] = this.expr(uri);
			}
			return resultSpaces;
		}
	}
	
	var _solver = new SolverImpl();
	
	export function decl(a: any, b?: any = null, expr?: any = null)
	{
		return _solver.decl(a, b, expr);
	}
	
	export function eval(uri?: string = null, localName?: string = null): any
	{
		return _solver.eval(uri, localName);
	}

	export function expr(uri?: string = null, localName?: string = null): any
	{
		return _solver.expr(uri, localName);
	}
	
	export function solver()
	{
		return <Solver> new SolverImpl();
	}
}