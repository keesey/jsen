///<reference path='../../src/jsen.d.ts' />
///<reference path='../../src/ecma262.ts' />
///<reference path='../qunit/qunit.d.ts' />
test("ECMA-262: Basic declarations", function () {
	var solver = jsen.solver();
    ecma262.decl(solver);
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
    ecma262.decl(solver);
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
    ecma262.decl(solver);
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


