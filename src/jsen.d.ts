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
		decl(namespaces: Namespaces): Solver;
		decl(uri: string, namespace: Namespace): Solver;
		decl(uri: string, localName: string, expression: any): Solver;
		eval(): Namespaces;
		eval(uri: string): Namespace;
		eval(uri: string, localName: string): any;
	}
	export function decl(namespaces: Namespaces): Solver;
	export function decl(uri: string, namespace: Namespace): Solver;
	export function decl(uri: string, map: (localName: string) => any): Solver;
	export function decl(uri: string, localName: string, expression: any): Solver;
	export function eval(): Namespaces;
	export function eval(uri: string): Namespace;
	export function eval(uri: string, localName: string): any;
	export function solver(): Solver;
}