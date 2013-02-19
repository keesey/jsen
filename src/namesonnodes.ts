///<reference path='./namesonnodes.d.ts' />

// polyfill
Object.freeze || (Object.freeze = (o) => o);

module jsen.namesonnodes
{
	var ARGS_GTE_2 = 'This operation requires at least two arguments.';

	var EMPTYSET = Object.freeze({
		empty: true,
		_map: Object.freeze({}),
		_units: 0,
		toString: STRING_FUNCTION
	});

	var NAMESPACE =
	{
		'arc': null, // :TODO:
		'branch': null, // :TODO:
		'clade': null, // :TODO:
		'crown': null, // :TODO:
		'dag': null, // :TODO:
		'diff': null, // :TODO:
		'emptyset': EMPTYSET,
		'eq': null, // :TODO:
		'intersect': null, // :TODO:
		'max': null, // :TODO:
		'min': null, // :TODO:
		'neq': null, // :TODO:
		'phylogeny': null, // :TODO:
		'prc': null, // :TODO:
		'prceq': null, // :TODO:
		'prcintersect': null, // :TODO:
		'prcunion': null, // :TODO:
		'prsubset': op_logic_multiple(subset),
		'prsuperset': null, // :TODO:
		'subset': op_logic_multiple(subset),
		'superset': op_logic_multiple((a: Taxic, b: Taxic) => subset(b, a)),
		'suc': null, // :TODO:
		'suceq': null, // :TODO:
		'sucintersect': null, // :TODO:
		'sucunion': null, // :TODO:
		'synprc': null, // :TODO:
		'total': null, // :TODO:
		'union': union,
		'universalset': null, // :TODO:
		'unit': unit
	};

	var STRING_FUNCTION = () => '[object jsen.namesonnodes.Taxic]';

	export var URI = "http://namesonnodes.org/ns/math/2013";

	function create(units: any = null)
	{
			if (units === null)
			{
				return EMPTYSET;
			}
			else if (Array.isArray(units))
			{
				var map = {},
					units = 0;
				for (var i = 0, n = (<any[]> units).length; i < n; ++i)
				{
					var id = units[i];
					if (!map[id])
					{
						units++;
						map[id] = true;
					}
				}
				if (units === 0)
				{
					return EMPTYSET;
				}
			}
		}
	}

	export function decl(solver?: jsen.Solver, uri?: string): jsen.Solver
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

	function subset(a: Taxic, b: Taxic)
	{
		
	}

	function union(...args: Taxic[]): Taxic
	{
		var empty = true,
			i = 0,
			n = args.length,
			map = {},
			size = 0,
			id: string;
		for ( ; i < n; ++i)
		{
			var arg = args[i];
			if (!arg.empty)
			{
				empty = false;
				for (id in arg.map)
				{
					size++;
					map[id] = true;
				}
			}
		}
		if (empty)
		{
			return EMPTYSET;
		}
		return Object.freeze({
			empty: false,
			map: Object.freeze(map),
			unit: size === 1,
			toString: STRING_FUNCTION
		});
	}

	export function unit(): Taxic
	{
		var id = String(Math.random()),
			map = {};
		map[id] = true;
		return Object.freeze({
			empty: false,
			map: Object.freeze(map),
			unit: true,
			toString: STRING_FUNCTION
		});
	}
}