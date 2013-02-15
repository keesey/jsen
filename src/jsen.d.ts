module jsen
{
	export interface Namespace
	{
		[localName: string]: any;
	}
	export interface Namespaces
	{
		[uri: string]: Namespace;
	}
	export interface Solver
	{
		decl(expressions: Namespaces): Solver;
		decl(uri: string, expressions: Namespace): Solver;
		decl(uri: string, localName: string, expression: any): Solver;
		eval(): Namespaces;
		eval(uri: string): Namespace;
		eval(uri: string, localName: string): any;
		expr(): Namespaces;
		expr(uri: string): Namespace;
		expr(uri: string, localName: string): any;
	}
	export function decl(expressions: Namespaces): Solver;
	export function decl(uri: string, expressions: Namespace): Solver;
	export function decl(uri: string, localName: string, expression: any): Solver;
	export function eval(): Namespaces;
	export function eval(uri: string): Namespace;
	export function eval(uri: string, localName: string): any;
	export function expr(): Namespaces;
	export function expr(uri: string): Namespace;
	export function expr(uri: string, localName: string): any;
	export function solver(): Solver;
}