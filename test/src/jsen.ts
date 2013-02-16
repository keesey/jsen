///<reference path='../../src/jsen.d.ts' />
///<reference path='../qunit/qunit.d.ts' />
test("Declaring constants", function() {
	var solver = jsen.solver();
	solver.decl('test',
	{
		"e": 2.718281828459045,
		"pi": 3.141592653589793,
		"t": true,
		"n": null,
		"f": false
	});
	deepEqual(solver.eval('test'),
    {
		"e": 2.718281828459045,
		"pi": 3.141592653589793,
		"t": true,
		"n": null,
		"f": false
	});
});
test("Identifier in declaration", function() {
    var solver = jsen.solver();
    solver.decl('test',
    {
        "x": 2,
        "y": "x"
    });
    deepEqual(solver.eval('test'),
    {
        "x": 2,
        "y": 2
    });
});
test("Circular declaration", function() {
    var solver = jsen.solver();
    throws(function()
    {
        solver.decl('test', { 'x': 'x' });
        solver.eval('test');
    }, Error);
    throws(function()
    {
        solver.decl('test', { 'x': 'y', 'y': 'x' });
        solver.eval('test');
    }, Error);
});
test("Function declaration", function() {
    var solver = jsen.solver();
    solver.decl('test',
    {
        "even": function( x ) { return x % 2 === 0; },
        "a":    <any[]> [ 'even', 2 ],
        "b":    <any[]> [ 'even', 3 ]
    });
    strictEqual(solver.eval('test', 'a'), true);
    strictEqual(solver.eval('test', 'b'), false);
});
test("Namespace reference ignored", function() {
    var solver = jsen.solver();
    solver.decl('test',
    {
        "ns": "namespace:",
        "x":  1
    });
    deepEqual(solver.eval('test'),
    {
        "x": 1
    });
});
test("Namespaces-level namespace reference", function() {
    var solver = jsen.solver();
    solver.decl({
        'A': 'namespaceA:',
        'namespaceA':
        {
            'x':  12
        },
        'namespaceB':
        {
            'y': 'A:x'
        }
    });
    strictEqual(solver.eval('namespaceB', 'y'), 12);
});
test("Function as namespace", function() {
    var solver = jsen.solver();
    solver.decl({
        'uppercase': (localName: string) => localName.toUpperCase(),
        'random': Math.random,
        'test':
        {
            'a': 'uppercase:FOO',
            'b': 'uppercase:bar'
        }
    });
    deepEqual(solver.eval('test'),
    {
        "a": 'FOO',
        "b": 'BAR'
    });
    var x = solver.eval('random', 'foo');
    var y = solver.eval('random', 'foo');
    var z = solver.eval('random', 'bar');
    strictEqual(x, y);
    notEqual(x, z);
});
