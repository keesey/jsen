///<reference path='../../src/jsen.d.ts' />
///<reference path='../../src/ecma262.ts' />
///<reference path='../qunit/qunit.d.ts' />
test("ECMA-262: Basic declarations", function () {
	var solver = jsen.solver();
    jsen.ecma262.decl(solver);
	solver.decl('test',
		{
		    "x": <any[]> ["http://ecma-international.org/ecma-262/5.1:+",
		            1,
		            2
		        ],
		    "y": <any[]> ["http://ecma-international.org/ecma-262/5.1:Math.sin",
		            <any[]> ["http://ecma-international.org/ecma-262/5.1:/",
		                "http://ecma-international.org/ecma-262/5.1:Math.PI",
		                2
		            ]
		        ],
		    "z": <any[]> ["http://ecma-international.org/ecma-262/5.1:Array",
		            4,
		            5,
		            6
		        ]
		}
    );
	deepEqual(solver.eval('test'),
	{
		"x": 3,
		"y": 1,
		"z": [4, 5, 6]
	});
});
test("ECMA-262: Referenced namespace", function () {
	var solver = jsen.solver();
    jsen.ecma262.decl(solver);
	solver.decl('test',
		{
		    "js": "http://ecma-international.org/ecma-262/5.1:",

		    "x": <any[]> [ "js:+", 1, 2 ],
		    "y": <any[]> [ "js:Math.sin", <any[]> [ "js:/", "js:Math.PI", 2 ] ],
		    "z": <any[]> [ "js:Array", 4, 5, 6 ]
		}
    );
	deepEqual(solver.eval('test'),
	{
		"x": 3,
		"y": 1,
		"z": [4, 5, 6]
	});
});
test("ECMA-262: Referenced namespace and own identifiers", function () {
	var solver = jsen.solver();
    jsen.ecma262.decl(solver);
	solver.decl('test',
		{
		    "pi": "js:Math.PI",
		    "tau": <any[]> [ "js:*", "pi", 2 ],

		    "js": "http://ecma-international.org/ecma-262/5.1:"
		}
    );
	deepEqual(solver.eval('test'),
	{
		"pi": Math.PI,
		"tau": Math.PI * 2
	});
});
test("ECMA-262: Literals", function()
{
	var solver = jsen.solver();
    jsen.ecma262.decl(solver);
	solver.decl('test',
		{
		    "js": "http://ecma-international.org/ecma-262/5.1:",

		    "a": "js:undefined",
		    "b": "js:NaN",
		    "c": "js:Infinity"
		}
    );
	strictEqual(solver.eval('test', 'a'), undefined);
	ok(isNaN(solver.eval('test', 'b')));
	strictEqual(solver.eval('test', 'c'), Infinity);
});
test("ECMA-262: Accessors", function()
{
	var solver = jsen.solver();
    jsen.ecma262.decl(solver);
	solver.decl('test',
		{
		    "js": "http://ecma-international.org/ecma-262/5.1:",

		    "a": <any[]> ["js:Array", 1, 3, 5, 7],
		    "b": <any[]> ["js:[]", 'a', 2]
		}
    );
	strictEqual(solver.eval('test', 'b'), 5);
});
test("ECMA-262: Operators", function()
{
	var solver = jsen.solver();
    jsen.ecma262.decl(solver);
	solver.decl('test',
		{
		    "js": "http://ecma-international.org/ecma-262/5.1:",

		    "a": <any[]> ["js:void", 88],
		    "b": <any[]> ["js:+", -1],
		    "c": <any[]> ["js:+", 2, -1],
		    "d": <any[]> ["js:+", 2, -1, 10],
		    "e": <any[]> ["js:-", -1],
		    "f": <any[]> ["js:-", 2, -1],
		    "g": <any[]> ["js:-", 2, -1, 10],
		    "h": <any[]> ["js:~", 7],
		    "i": <any[]> ["js:!", true]
		    // :TODO: The rest: `*`, `/`, `%`, `<<`, `>>`, `>>>`, `<`, `>`, `<=`, `>=`, `in`, `==`, `!=`, `===`, `!==`, `&`, `^`, `|`, `&&`, `||`, `?:`.
		}
    );
	deepEqual(solver.eval('test'),
	{
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
// :TODO: Top-level functions: `isFinite`, `isNaN`, `Array`, `Boolean`, `Number`.
// :TODO: All constants of the `Math` object (`Math.E`, `Math.LN2`, etc.).
// :TODO: All functions of the `Math` object (`Math.abs`, `Math.acos`, etc.).
test("ECMA-262: Using JSEN examples", function()
{
	jsen.decl('urn:my-namespace', 'my-id', 10); // The last argument can be any JSEN expression.
	strictEqual(jsen.eval('urn:my-namespace', 'my-id'), 10);
	jsen.decl('urn:my-namespace', 'my-id', 10)
	    .decl('urn:my-namespace', 'my-id', 10);
	strictEqual(jsen.eval('urn:my-namespace', 'my-id'), 10);
	jsen.ecma262.decl();
	jsen.decl('urn:my-namespace', 'my-array-id', <any[]> ['http://ecma-international.org/ecma-262/5.1:Array', 1, 2]);
	deepEqual(jsen.eval('urn:my-namespace', 'my-array-id'), [1, 2]);
	jsen.decl('urn:my-namespace', {
		'js': 'http://ecma-international.org/ecma-262/5.1:',

		'my-id': 10,
		'my-array-id': <any[]> ['js:Array', 1, 2]
	});
	deepEqual(jsen.eval('urn:my-namespace'), { 'my-id': 10, 'my-array-id': [1, 2]});
	jsen.decl({
		'urn:my-namespace': {
			'js': 'http://ecma-international.org/ecma-262/5.1:',

			'my-id': 10,
			'my-array-id': <any[]> ['js:Array', 1, 2]
		},
		'urn:my-other-namespace': {
			'my-id': 20
		}
	});
	deepEqual(jsen.eval(), { 'urn:my-namespace': { 'my-id': 10, 'my-array-id': [1, 2]}, 'urn:my-other-namespace': { 'my-id': 20 }, 'http://ecma-international.org/ecma-262/5.1': jsen.eval(jsen.ecma262.URI) });

	var solver = jsen.solver();
	jsen.ecma262.decl(solver); // To make ECMA-262 entities available.
	solver.decl({
		'urn:my-namespace': {
			'js': 'http://ecma-international.org/ecma-262/5.1:',

			'my-id': 33,
			'my-array-id': <any[]> ['js:Array', 5, 6, 7]
		},
		'urn:my-other-namespace': {
			'my-id': 44
		}
	});
	deepEqual(solver.eval(), { 'urn:my-namespace': { 'my-id': 33, 'my-array-id': [5, 6, 7]}, 'urn:my-other-namespace': { 'my-id': 44 }, 'http://ecma-international.org/ecma-262/5.1': jsen.eval(jsen.ecma262.URI) });
});