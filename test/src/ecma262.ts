///<reference path='../../src/jsen.d.ts' />
///<reference path='../../src/ecma262.ts' />
///<reference path='../qunit/qunit.d.ts' />
test("Basic declarationsusing ECMA-262", function () {
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
	deepEqual(solver.eval('test'), {
			"x": 3,
    		"y": 1,
    		"z": [4, 5, 6]
		});
});

