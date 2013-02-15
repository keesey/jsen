JavaScript Expression Notation (JSEN)
=====================================
by T. Michael Keesey (<keesey@gmail.com>)

**JSEN** is a subset of JavaScript (based on the [ECMA-262 5.1](http://www.ecma-international.org/ecma-262/5.1/) standard and largely overlapping [JSON](http://json.org/)) that can represent mathematical expressions, and an associated [TypeScript](http://typescriptlang.org/)/JavaScript library.

License
-------
JSEN is available under the MIT license. For more details, see the `LICENSE` file.

Important Files
---------------
* `bin/jsen.js`: JSEN as a JavaScript file.
* `bin/jsen.min.js`: A minified version of `jsen.js`.
* `bin/ecma262.js`: ECMA-262 namespace for JSEN.
* `src/jsen.ts`: The TypeScript source for JSEN.
* `src/jsen.d.ts`: A TypeScript declaration file for JSEN.
* `src/ecma262.ts`: The TypeScript source for the ECMA-262 namespace.
* `src/ecma262.d.ts`: A TypeScript declaration for the ECMA-262 namespace.
* `build.sh`: UNIX shell script to build the JavaScript files from TypeScript source. Requires Java and the [TypeScript](http://typescriptlang.org/) compiler.

The JSEN Format
---------------

JSEN is JavaScript wherein values are interpreted as expressions.

A **String** is interpreted as:
* a *namespace reference*, if it ends with `":"`;
* a *qualified identifier*, if it includes (but does not end with) `":"`; or
* a *local identifier*, otherwise.

An **Array** is interpreted as an *application of an operation*, where the first element is a string identifying the operation and the following elements (if any) are arguments.
An empty array (`[]`) is illegal.

An **Object** (associative array) is interpreted either as:
* a set of *declarations*, where each key is a [local] identifier and each value is an evaluable expression, or
* a *namespace*, where each key is a [URI](http://tools.ietf.org/html/rfc3986) and each value is a set of declarations.

All other value types (**Null**, **Boolean**, **Number**, **Function**, nested objects, etc.) are interpreted as *themselves*.

### Examples

Here is a JSEN declaration for a namespace whose local identifiers represent approximations of numerical constants:

	{
		"e": 2.718281828459045,
		"pi": 3.141592653589793
	}

The JSEN library optionally includes a namespace with the URI `"http://ecma-international.org/ecma-262/5.1"` that contains certain elements of the ECMA-262 standard.
Using this, expressions like the following may be formed:

	{
		"x": ["http://ecma-international.org/ecma-262/5.1:+",
				1,
				2
			],
		"y": ["http://ecma-international.org/ecma-262/5.1:Math.sin",
				["http://ecma-international.org/ecma-262/5.1:/",
					"http://ecma-international.org/ecma-262/5.1:Math.PI",
					2
				]
			],
		"z": ["http://ecma-international.org/ecma-262/5.1:Array",
				4,
				5,
				6
			]
	}

When evaluated, `"x"` will yield `3` (JavaScript: `1 + 2`), `"y"` will yield `1` (JavaScript: `Math.sin(Math.PI / 2)`), and `"z"` will yield `[4, 5, 6]` (JavaScript: `Array(4, 5, 6)`).

Since this sort of expression is rather verbose, JSEN allows for arbitrary references to namespaces:

	{
		"js": "http://ecma-international.org/ecma-262/5.1:",

		"x": [ "js:+", 1, 2 ],
		"y": [ "js:Math.sin", [ "js:/", "js:Math.PI", 2 ] ],
		"z": [ "js:Array", 4, 5, 6 ]
	}

These references only pertain to the namespaces they were declared under, and are not externally accessible.

Identifiers may be declared in any order, and may refer to other identifiers.
Within a namespace local names may be used.

	{
		"pi": "js:Math.PI",
		"tau": [ "js:*", "pi", 2 ],

		"js": "http://ecma-international.org/ecma-262/5.1:"
	}

Note that cyclical references will cause errors when evaluated.
The following expression is illegal:

	{
		"x": "y",
		"y": "x"
	}

All of the expressions listed so far are JSON, but non-JSON JavaScript may also be used for values not possible under JSON (such as functions):

	{
		"even": function( x ) { return x % 2 === 0; },
		"a":    [ 'even', 2 ],
		"b":    [ 'even', 3 ]
	}

When evaluated, `"a"` will yield `true` and `"b"` will yield `false`.

### The ECMA-262 5.1 Namespace

As mentioned earlier, JSEN optionally provides a namespace, identified by the URI `"http://ecma-international.org/ecma-262/5.1"`, for certain elements of the ECMA-262 standard.
These include:

* Literals: `undefined`, `NaN`, `Infinity`.
* Accessors: `[]`.
* Operators: `void`, `+`, `-`, `~`, `!`, `*`, `/`, `%`, `<<`, `>>`, `>>>`, `<`, `>`, `<=`, `>=`, `in`, `==`, `!=`, `===`, `!==`, `&`, `^`, `|`, `&&`, `||`, `?:`.
* Top-level functions: `isFinite`, `isNaN`, `Array`, `Boolean`, `Number`.
* All constants of the `Math` object (`Math.E`, `Math.LN2`, etc.).
* All functions of the `Math` object (`Math.abs`, `Math.acos`, etc.).

Using JSEN
----------

The simplest way to use JSEN is to use the **global** functions. To declare an identifier as representing the value of an expression:

	jsen.decl('urn:my-namespace', 'my-id', 10); // The last argument can be any JSEN expression.

The expression may be evaluated like so:

	jsen.eval('urn:my-namespace', 'my-id'); // 10

To use the ECMA-262 entities:

	jsen.ecma262.decl();

Now you can use the entities:

	jsen.decl('urn:my-namespace', 'my-array-id', ['http://ecma-international.org/ecma-262/5.1:Array', 1, 2]);
	jsen.eval('urn:my-namespace', 'my-array-id'); // [1, 2]

You can also retrieve the expression associated with an identifier:

	jsen.expr('urn:my-namespace', 'my-array-id'); // ['http://ecma-international.org/ecma-262/5.1:Array', 1, 2]

Namespaces may be declared all at once. When this is done, you may use abbreviated namespace references:

	jsen.decl('urn:my-namespace', {
		'js': 'http://ecma-international.org/ecma-262/5.1:',

		'my-id': 10,
		'my-array-id': ['js:Array', 1, 2]
	});

You may also retrieve the values or expressions of a namespace all at once:

	jsen.eval('urn:my-namespace'); // { 'my-id': 10, 'my-array-id': [1, 2]}
	jsen.expr('urn:my-namespace'); // { 'my-id': 10, 'my-array-id': ['http://ecma-international.org/ecma-262/5.1:Array', 1, 2]}

Note that the namespace reference is expanded into a URI when the expression is retrieved.

A set of namespaces may be declared, evaluated, or expressed all at once:

	jsen.decl({
		'urn:my-namespace': {
			'js': 'http://ecma-international.org/ecma-262/5.1:',

			'my-id': 10,
			'my-array-id': ['js:Array', 1, 2]
		},
		'urn:my-other-namespace': {
			'my-id': 20
		}
	});
	jsen.eval(); // { 'urn:my-namespace': { 'my-id': 10, 'my-array-id': [1, 2]}, 'urn:my-other-namespace': { 'my-id': 20 } }
	jsen.expr(); // { 'urn:my-namespace': { 'my-id': 10, 'my-array-id': ['http://ecma-international.org/ecma-262/5.1:Array', 1, 2]}, 'urn:my-other-namespace': { 'my-id': 20 } }

### Solver Instances

Apart from the global functions, you may use a **solver instance**. This prevents collisions with other code using JSEN.

To create a solver instance:

	var solver = jsen.solver();

Now you can use all the global functions in the same manner:

	solver.decl({
		'urn:my-namespace': {
			'js': 'http://ecma-international.org/ecma-262/5.1:',

			'my-id': 33,
			'my-array-id': ['js:Array', 5, 6, 7]
		},
		'urn:my-other-namespace': {
			'my-id': 44
		}
	});
	solver.eval(); // { 'urn:my-namespace': { 'my-id': 33, 'my-array-id': [5, 6, 7]}, 'urn:my-other-namespace': { 'my-id': 44 } }
	solver.expr(); // { 'urn:my-namespace': { 'my-id': 22, 'my-array-id': ['http://ecma-international.org/ecma-262/5.1:Array', 5, 6, 7]}, 'urn:my-other-namespace': { 'my-id': 44 } }
