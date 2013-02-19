///<reference path='./namesonnodes.d.ts' />

// polyfill
Object.freeze || (Object.freeze = (o) => o);

module jsen.namesonnodes
{
	var ARGS_GTE_2 = 'This operation requires at least two arguments.';

	var CACHE = {};

	var EMPTYSET = Object.freeze({
		empty: true,
		map: Object.freeze({}),
		toString: STRING_FUNCTION,
		units: 0
	});

	var NAMESPACE =
	{
		'branch': (x: Taxic, y: Taxic) => diff(prcintersect(x), prcunion(y)),
		'clade': clade,
		'cladogen': cladogen,
		'crown': (x: Taxic, extant: Taxic) => clade(intersect(clade(x), extant)),
		'diff': op_multiple(diff),
		'emptyset': EMPTYSET,
		'eq': op_logic_multiple(eq),
		'intersect': intersect,
		'max': max,
		'min': min,
		'neq': op_logic_multiple((a: Taxic, b: Taxic) => !eq(a, b)),
		'prc': op_logic_multiple(prc),
		'prceq': op_logic_multiple((x: Taxic, y: Taxic) => eq(x, y) || prc(x, y)),
		'prcintersect': op_multiple(prcintersect),
		'prcunion': op_multiple(prcunion),
		'prsuperset': op_logic_multiple((x: Taxic, y: Taxic) => prsubset(y, x)),
		'prsubset': op_logic_multiple(prsubset),
		'superset': op_logic_multiple((x: Taxic, y: Taxic) => subset(y, x)),
		'subset': op_logic_multiple(subset),
		'suc': op_logic_multiple(suc),
		'suceq': op_logic_multiple((x: Taxic, y: Taxic) => eq(x, y) || suc(x, y)),
		'sucintersect': op_multiple(sucintersect),
		'sucunion': op_multiple(sucunion),
		'synprc': synprc,
		'total': total,
		'union': union,
		'unit': unit
	};

	var STRING_FUNCTION = () => '[object jsen.namesonnodes.Taxic]';

	export var URI = "http://namesonnodes.org/ns/math/2013";

	function clade(x: Taxic)
	{
		return cladogen(x)
			? sucunion(x)
			: sucunion(max(prcintersect(x)));
	}

	function cladogen(x: Taxic): bool
	{
		if (x.empty)
		{
			return false;
		}
		if (x.units === 1)
		{
			return true;
		}
		return !sucintersect(x).empty;
	}

	function create(units: any = null)
	{
		var map: { [id: string]: bool; },
			unitCount: number,
			id: string;
		if (!units)
		{
			return EMPTYSET;
		}
		map = {};
		unitCount = 0;
		if (Array.isArray(units))
		{
			for (var i = 0, n = (<any[]> units).length; i < n; ++i)
			{
				id = String(units[i]);
				if (!map[id])
				{
					unitCount++;
					map[id] = true;
				}
			}
		}
		else
		{
			for (id in units)
			{
				unitCount++;
				map[id] = true;
			}
		}
		if (unitCount === 0)
		{
			return EMPTYSET;
		}
		return Object.freeze({
			empty: false,
			map: Object.freeze(map),
			toString: STRING_FUNCTION,
			units: unitCount
		});
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

	function diff(x: Taxic, y: Taxic): Taxic
	{
		if (x.empty || y.empty)
		{
			return x;
		}
		var map = {},
			units = 0,
			id: string;
		for (id in x.map)
		{
			if (!y.map[id])
			{
				map[id] = true;
				units++;
			}
		}
		if (units === 0)
		{
			return EMPTYSET;
		}
		return Object.freeze({
			empty: false,
			map: Object.freeze(map),
			toString: STRING_FUNCTION,
			units: units
		});
	}

	function eq(a: Taxic, b: Taxic): bool
	{
		if (a == b)
		{
			return true;
		}
		if (a.units !== b.units)
		{
			return false;
		}
		var id: string;
		for (id in a.map)
		{
			if (!b[id])
			{
				return false;
			}
		}
		return true;
	}

	function intersect(...args: Taxic[]): Taxic
	{
		var i = 1,
			n = args.length,
			map = {},
			units = 0,
			id: string,
			arg: Taxic;
		if (n < 2)
		{
			throw new Error(ARGS_GTE_2);
		}
		arg = args[0];
		if (arg.empty)
		{
			return EMPTYSET;
		}
		for (id in arg.map)
		{
			map[id] = true;
			units++;
		}
		for ( ; i < n; ++i)
		{
			if (args[i].empty)
			{
				return EMPTYSET;
			}
		}
		for (i = 1; i < n; ++i)
		{
			arg = args[i];
			for (id in map)
			{
				if (!arg.map[id])
				{
					units--;
					delete map[id];
					if (units === 0)
					{
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

	function max(a: Taxic): Taxic
	{
		// :TODO:
	}

	function min(a: Taxic): Taxic
	{
		// :TODO:
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

	function prc(a: Taxic, b: Taxic): bool
	{
		// :TODO:
	}

	function prcintersect(a: Taxic): Taxic
	{
		// :TODO:
	}

	function prcunion(a: Taxic): Taxic
	{
		// :TODO:
	}

	function prsubset(a: Taxic, b: Taxic): bool
	{
		// :TODO:
	}

	function subset(a: Taxic, b: Taxic): bool
	{
		// :TODO:
	}

	function suc(a: Taxic, b: Taxic): bool
	{
		// :TODO:
	}

	function sucintersect(a: Taxic): Taxic
	{
		// :TODO:
	}

	function sucunion(a: Taxic): Taxic
	{
		// :TODO:
	}

	function synprc(apomorphic: Taxic, representative: Taxic): Taxic
	{
		// :TODO:
	}

	function total(x: Taxic, extant: Taxic): Taxic
	{
		// :TODO:
	}

	function union(...args: Taxic[]): Taxic
	{
		var i = 0,
			n = args.length,
			map = {},
			units = 0,
			id: string;
		for ( ; i < n; ++i)
		{
			var arg = args[i];
			for (id in arg.map)
			{
				if (!map[id])
				{
					units++;
					map[id] = true;
				}
			}
		}
		if (units === 0)
		{
			return EMPTYSET;
		}
		return Object.freeze({
			empty: false,
			map: Object.freeze(map),
			toString: STRING_FUNCTION,
			units: units
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
			toString: STRING_FUNCTION,
			units: 1
		});
	}
}