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
* a *namespace reference*, if it ends with `":"` (but not with `"\\:"`);
* a *qualified identifier*, if it includes (but does not end with) `":"`; or
* a *local identifier*, otherwise.

Colons (`":"`) in strings may be escaped by a preceding backslash.
Since backslashes must be escaped in JavaScript strings, this is written as two backslashes: `"\\"`.
This does not pertain to keys used as local identifiers in namespace declarations (read on).

An **Array** is interpreted as an *application of an operation*, where the first element is a string identifying the operation and the following elements (if any) are arguments.
An empty array (`[]`) is illegal.

An **Object** (associative array) is interpreted either as:
* a set of *declarations*, where each key is a local identifier and each value is an evaluable expression, or
* a *namespace*, where each key is a [URI](http://tools.ietf.org/html/rfc3986) and each value is a set of declarations.

All other value types (**Null**, **Boolean**, **Number**, **Function**, nested objects, etc.) are interpreted as *themselves*.

### Examples

#### Constants

Here is a JSEN declaration for a namespace whose local identifiers represent approximations of numerical constants:

	{
		"e": 2.718281828459045,
		"pi": 3.141592653589793
	}

#### ECMA-262 Entities

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

The available ECMA-262 entities are:

* Literals:

	`undefined` `NaN` `Infinity`
* Accessors:

	`[]`
* Operators:

	`void` `+` `-` `~` `!` `*` `/` `%` `<<` `>>` `>>>` `<` `>` `<=` `>=` `in` `==` `!=` `===` `!==` `&` `^` `|` `&&` `||` `?:`

	(Note that since colons (`":"`) are reserved in JSEN identifiers, the `?:` operator's name must be written `"?\\:"`.)
* Top-level functions:
	
	`isFinite` `isNaN` `Array` `Boolean` `Number`

	The `Array` function has been modified so that a single argument yields an array with that as its single member (instead of using it to determine the length of the array).

* All constants of the `Math` object (`Math.E`, `Math.LN2`, etc.).
* All functions of the `Math` object (`Math.abs`, `Math.acos`, etc.).

#### Namespace References

Since repeated URIs can make expressions rather verbose, JSEN allows for arbitrary references to namespaces:

	{
		"js": "http://ecma-international.org/ecma-262/5.1:",

		"x": [ "js:+", 1, 2 ],
		"y": [ "js:Math.sin", [ "js:/", "js:Math.PI", 2 ] ],
		"z": [ "js:Array", 4, 5, 6 ]
	}

These references only pertain to the namespaces they were declared under, and are not externally accessible.

#### Notes on Identifiers

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

#### Non-JSON JavaScript

All of the expressions listed so far are JSON, but non-JSON JavaScript may also be used for values not possible under JSON (such as functions):

	{
		"even": function( x ) { return x % 2 === 0; },
		"a":    [ "even", 2 ],
		"b":    [ "even", 3 ]
	}

When evaluated, `"a"` will yield `true` and `"b"` will yield `false`.

Using JSEN
----------

### Global Functions

The simplest way to use JSEN is to use the **global functions**. To declare an identifier as representing the value of an expression:

	jsen.decl('urn:my-namespace', 'my-id', 10); // The last argument can be any JSEN expression.

The expression may be evaluated like so:

	jsen.eval('urn:my-namespace', 'my-id'); // 10

Declarations may be chained:

	jsen.decl('urn:my-namespace', 'my-id', 10)
	    .decl('urn:my-namespace', 'my-id-2', 20);

#### EMCA-262 Entities

To use the ECMA-262 entities:

	jsen.ecma262.decl();

Now you can use the entities:

	jsen.decl('urn:my-namespace', 'my-array-id', ['http://ecma-international.org/ecma-262/5.1:Array', 1, 2]);
	jsen.eval('urn:my-namespace', 'my-array-id'); // [1, 2]

For convenience, the ECMA-262 URI is available as a constant: `jsen.ecma262.URI`.

#### Declaring and Evaluating an Entire Namespace

Namespaces may be declared all at once. When this is done, you may use abbreviated namespace references:

	jsen.decl('urn:my-namespace', {
		'js': 'http://ecma-international.org/ecma-262/5.1:',

		'my-id': 10,
		'my-array-id': ['js:Array', 1, 2]
	});

You may also evaluate every identifier in a namespace at once:

	jsen.eval('urn:my-namespace'); // { 'my-id': 10, 'my-array-id': [1, 2]}

#### Declaring and Evaluating Multiple Namespaces

A set of namespaces may be declared or evaluated all at once:

	jsen.decl({

		'js': 'http://ecma-international.org/ecma-262/5.1:',

		'urn:my-namespace':
		{
			'my-id': 10,
			'my-array-id': ['js:Array', 1, 2]
		},

		'urn:my-other-namespace':
		{
			'my-id': ['js:+', 10, 10]
		}

	});
	jsen.eval(); // { 'urn:my-namespace': { 'my-id': 10, 'my-array-id': [1, 2]}, 'urn:my-other-namespace': { 'my-id': 20 } /* Plus all ECMA-262 entities */ }

Note that the namespace reference at the top level (`'js'`) is available in both of the declared namespaces.

#### Functions As Namespaces

A function may be used as a namespace. It should expect a single argument (a local identifier).
Its output need not be consistent (that is, it can be random), since JSEN stores evaluations.

	jsen.decl({
		'random':    Math.random,
		'uppercase': function(localName) { return localName.toUpperCase(); }
	});
	jsen.eval('random', 'foo');    // A random number.
	jsen.eval('random', 'foo');    // The same number.
	jsen.eval('random', 'bar');    // A different random number.
	jsen.eval('uppercase', 'foo'); // "FOO"

### Solver Instances

Apart from the global functions, you may use a **solver instance**. This prevents collisions with other code using JSEN.

To create a solver instance:

	var solver = jsen.solver();

Now you can use all the functions in the same manner as the global functions:

	jsen.ecma262.decl(solver); // To make ECMA-262 entities available.
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
	solver.eval(); // { 'urn:my-namespace': { 'my-id': 33, 'my-array-id': [5, 6, 7]}, 'urn:my-other-namespace': { 'my-id': 44 } /* Plus all ECMA-262 entities */ }
