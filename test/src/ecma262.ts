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
test("ECMA-262: Top-level referenced namespace", function () {
	var solver = jsen.solver();
    jsen.ecma262.decl(solver);
	solver.decl({
		'js': 'http://ecma-international.org/ecma-262/5.1:',
		'urn:my-namespace':
		{
			'my-id': 10,
			'my-array-id': <any[]> ['js:Array', 1, 2]
		},
		'urn:my-other-namespace':
		{
			'my-id': <any[]> ['js:+', 10, 10]
		}
	});
	deepEqual(solver.eval('urn:my-namespace'),
	{
		"my-id": 10,
		"my-array-id": [1, 2]
	});
	deepEqual(solver.eval('urn:my-other-namespace'),
	{
		"my-id": 20
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
		    "i": <any[]> ["js:!", true],
		    "j": <any[]> ["js:*", 2, 3, 4],
		    "k": <any[]> ["js:/", 12, 3, 2],
		    "l": <any[]> ["js:%", 4, 3],
		    "m": <any[]> ["js:<<", 1, 3],
		    "n": <any[]> ["js:>>", 129, 1],
		    "o": <any[]> ["js:>>>", 129, 1],
		    "p": <any[]> ["js:<", 5, 6],
		    "q": <any[]> ["js:>", 5, 6],
		    "r": <any[]> ["js:<=", 5, 5],
		    "s": <any[]> ["js:>=", 5, 5],
		    "t": <any[]> ["js:in", 1, <any[]> ["js:Array", 10, 20, 30] ],
		    "u": <any[]> ["js:==", null, undefined],
		    "v": <any[]> ["js:!=", null, undefined],
		    "w": <any[]> ["js:===", null, undefined],
		    "x": <any[]> ["js:!==", null, undefined],
		    "y": <any[]> ["js:&", 7, 13],
		    "z": <any[]> ["js:^", 7, 13],
		    "A": <any[]> ["js:|", 7, 13],
		    "B": <any[]> ["js:&&", true, true, true, false],
		    "C": <any[]> ["js:||", true, true, true, false],
		    "D": <any[]> ["js:?\\:", true, 33, 44]
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
		"i": false,
		"j": 24,
		'k': 2,
		'l': 1,
		'm': 8,
		'n': 64,
		'o': 64,
		'p': true,
		'q': false,
		'r': true,
		's': true,
		't': true,
		'u': true,
		'v': false,
		'w': false,
		'x': true,
		'y': 5,
		'z': 10,
		'A': 15,
		'B': false,
		'C': true,
		'D': 33
	});
});
test("ECMA-262: Top-level functions", function()
{
	var solver = jsen.solver();
    jsen.ecma262.decl(solver);
	solver.decl('test',
	{
	    "js": "http://ecma-international.org/ecma-262/5.1:",

		'a': ['js:isFinite', 'js:Infinity'],
		'b': ['js:isFinite', 'js:NaN'],
		'c': <any[]> ['js:isFinite', 1],
		'd': ['js:isNaN', 'js:NaN'],
		'e': <any[]> ['js:isNaN', 1],
		'f': ['js:Array'],
		'g': <any[]> ['js:Array', 1],
		'h': <any[]> ['js:Array', 1, 2, 3, 4, 5],
		'i': <any[]> ['js:Boolean', 0],
		'j': <any[]> ['js:Boolean', 1],
		'k': <any[]> ['js:Number', false]
	});
	deepEqual(solver.eval('test'),
	{
		'a': false,
		'b': false,
		'c': true,
		'd': true,
		'e': false,
		'f': [],
		'g': [1],
		'h': [1, 2, 3, 4, 5],
		'i': false,
		'j': true,
		'k': 0
	});
});
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
	strictEqual(solver.evalExpr('urn:my-namespace:my-id'), 33);
	strictEqual(solver.evalExpr(<any[]> [ 'http://ecma-international.org/ecma-262/5.1:-', 'urn:my-namespace:my-id', 11 ]), 22);
});