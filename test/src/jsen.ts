///<reference path='../../src/jsen.d.ts' />
///<reference path='../qunit/qunit.d.ts' />
test("Declaring constants", function () {
	var solver = jsen.solver();
	solver.decl('test',
		{
			"e": 2.718281828459045,
    		"pi": 3.141592653589793,
    		"t": true,
    		"n": null,
    		"f": false
    	});
	deepEqual(solver.eval('test'), {
			"e": 2.718281828459045,
    		"pi": 3.141592653589793,
    		"t": true,
    		"n": null,
    		"f": false
		});
});
