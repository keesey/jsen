///<reference path='./jsen.d.ts' />

// Polyfill.
Array.isArray || (Array.isArray = (a) => ('' + a !== a) && {}.toString.call(a) === '[object Array]'));

module jsen
{
	function isNamespaceRef(expr)
	{
		return (typeof expr === 'string') && /[^\\]:$/.test(expr);
	}

	function expandNamespaceRefs(expr, nsRefHolder: Namespace): any
	{
		if (typeof expr === "string")
		{
			var parts = splitIdentifier(expr);
			if (parts.length >= 2)
			{
				var n_1 = parts.length - 1,
					uri = parts.slice(0, n_1).join(':'),
					uriExpr = nsRefHolder[uri];
				if (isNamespaceRef(uriExpr))
				{
					return uriExpr + parts[n_1].replace(':', '\\:');
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
				a[i] = expandNamespaceRefs(expr[i], nsRefHolder);
			}
			return a;
		}
		return expr;
	}

	function splitIdentifier(identifier: string): string[]
	{
		var result = [],
			current = "";
		for (var i = 0, n = identifier.length; i < n; ++i)
		{
			var c = identifier.charAt(i);
			if (c === '\\')
			{
				if (i < n - 1 && identifier.charAt(i + 1) === ':')
				{
					current += ':';
					i++;
				}
				else
				{
					current += '\\';
				}
			}
			else if (c === ':')
			{
				result.push(current);
				current = "";
			}
			else
			{
				current += c;
			}
		}
		result.push(current);
		return result;
	}

	function trickleNamespaceRefs(namespaces: Namespaces, ns: Namespace): Namespace
	{
		var refs = {},
			hasRefs = false,
			uri: string;
		for (uri in namespaces)
		{
			var expr = namespaces[uri];
			if (isNamespaceRef(expr))
			{
				refs[uri] = expr;
				hasRefs = true;
			}
		}
		if (!hasRefs)
		{
			return ns;
		}
		var ns2: Namespace = {},
			localName: string;
		for (localName in refs)
		{
			ns2[localName] = refs[localName];
		}
		for (localName in ns)
		{
			ns2[localName] = ns[localName];
		}
		return ns2;
	}

	export class SolverImpl
	{
		private _eval: Namespaces;
		private _expr: Namespaces = {};
		private _maps: Namespace = {};
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
			var parts = splitIdentifier(expr),
				n = parts.length;
			if (n < 2)
			{
				if (uri === undefined)
				{
					throw new Error("Cannot use local identifiers when there is no URI.");
				}
				return this.eval(uri, parts.join(":"));
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
				uri2: string,
				localName: string,
				expr,
				expr2;
			this._eval = null;
			if (typeof a === "string")
			{
				if (typeof b === "string")
				{
					this._nsExpr(<string> a)[b] = expr;
				}
				else if (typeof b === 'function')
				{
					this._maps[a] = b;
				}
				else 
				{
					var ns = this._nsExpr(<string> a);
					for (localName in b)
					{
						expr = b[localName];
						if (!isNamespaceRef(expr))
						{
							ns[localName] = expandNamespaceRefs(expr, b);
						}
					}
				}
			}
			else
			{
				for (uri in a)
				{
					expr = a[uri];
					if (!isNamespaceRef(expr))
					{
						this.decl(uri, trickleNamespaceRefs(a, expr));
					}
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
						var nsExpr = this._nsExpr(uri);
						if (!nsExpr.hasOwnProperty(localName) && typeof this._maps[uri] === 'function')
						{
							value = this._maps[uri](localName);
						}
						else
						{
							value = this._evalExpr(uri, nsExpr[localName]);
						}
					}
					finally
					{
						delete this._stack[qName];
					}
					return sourceNS[localName] = value;
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
		evalExpr(expression: any): any
		{
			return this._evalExpr(undefined, expression);
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

	export function evalExpr(expression: any): any
	{
		return _solver.evalExpr(expression);
	}
	
	export function solver()
	{
		return <Solver> new SolverImpl();
	}
}