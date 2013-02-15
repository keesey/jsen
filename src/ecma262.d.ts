///<reference path='./jsen.d.ts' />
declare module ecma262
{
	export var URI: string;

	export function decl(solver?: jsen.Solver, uri?: string): jsen.Solver;
}