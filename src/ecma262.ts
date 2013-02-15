///<reference path='./ecma262.d.ts' />
module jsen.ecma262
{
	export var URI = "http://ecma-international.org/ecma-262/5.1";

	var NAMESPACE =
	{
		// Literals
		"undefined": undefined,
		"NaN": NaN,
		"Infinity": Infinity,
		
		// Accessors
		"[]": (x, y) => x[y],

		// Operators
		"void": (x) => void x,
		"+": op_any((x) => +x, (x, y) => x + y),
		"-": op_any((x) => -x, (x, y) => x - y),
		"~": (x) => ~x,
		"!": (x) => !x,
		"*": op_multiple((x, y) => x * y),
		"/": op_multiple((x, y) => x / y),
		"%": op_multiple((x, y) => x % y),
		"<<": op_multiple((x, y) => x << y),
		">>": op_multiple((x, y) => x >> y),
		">>>": op_multiple((x, y) => x >>> y),
		"<": op_logic_multiple((x, y) => x < y),
		">": op_logic_multiple((x, y) => x > y),
		"<=": op_logic_multiple((x, y) => x <= y),
		">=": op_logic_multiple((x, y) => x >= y),
		"in": (x, y) => x in y,
		"==": op_logic_multiple((x, y) => x == y),
		"!=": op_logic_multiple((x, y) => x != y),
		"===": op_logic_multiple((x, y) => x === y),
		"!==": op_logic_multiple((x, y) => x !== y),
		"&": op_multiple((x, y) => x & y),
		"^": op_multiple((x, y) => x ^ y),
		"|": op_multiple((x, y) => x | y),
		"&&": and,
		"||": or,
		"?:": (cond, x, y) => cond ? x: y,

		// Top-level functions
		"isFinite": isFinite,
		"isNaN": isNaN,
		"Array": Array,
		"Boolean": Boolean,
		"Number": Number,

		// Math constants
		"Math.E": Math.E,
		"Math.LN2": Math.LN2,
		"Math.LN10": Math.LN10,
		"Math.LOG2E": Math.LOG2E,
		"Math.LOG10E": Math.LOG10E,
		"Math.PI": Math.PI,
		"Math.SQRT1_2": Math.SQRT1_2,
		"Math.SQRT2": Math.SQRT2,

		// Math functions
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

	function and(...args:any[])
	{
		var n = args.length;
		if (n === 0)
		{
			throw new Error(ARGS_GTE_1);
		}
		for (var i = 0; i < n; ++i)
		{
			if (!args[i])
			{
				return false;
			}
		}
		return true;
	}

	function or(...args:any[])
	{
		var n = args.length;
		if (n === 0)
		{
			throw new Error(ARGS_GTE_1);
		}
		for (var i = 0; i < n; ++i)
		{
			if (args[i])
			{
				return true;
			}
		}
		return false;
	}

	function op_any(single: (x) => any, double: (x, y) => any)
	{
		return function(...args: any[])
		{
			var n = args.length;
			if (n === 0)
			{
				throw new Error(ARGS_GTE_1);
			}
			if (n === 1)
			{
				return single(args[0]);
			}
			var result = args[0];
			for (var i = 1; i < n; ++i)
			{
				result = double(result, args[i]);
			}
			return result;
		};
	}

	function op_logic_multiple(op: (x, y) => bool)
	{
		return function(...args:any[])
		{
			var n = args.length;
			if (n < 2)
			{
				throw new Error(ARGS_GTE_2);
			}
			for (var i = 1; i < n; ++i)
			{
				if (!op(args[i - 1], args[i]))
				{
					return false;
				}
			}
			return true;
		};
	}

	function op_multiple(op: (x, y) => any)
	{
		return function(...args:any[])
		{
			var n = args.length;
			if (n < 2)
			{
				throw new Error(ARGS_GTE_2);
			}
			var result = args[0];
			for (var i = 1; i < n; ++i)
			{
				result = op(result, args[i]);
			}
			return result;
		};
	}

	export function decl(solver?: jsen.Solver = null, uri?: string = null): jsen.Solver
	{
		if (uri === null)
		{
			uri = URI;
		}
		if (solver)
		{
			return solver.decl(uri, NAMESPACE);
		}
		return jsen.decl(uri, NAMESPACE);
	}
}