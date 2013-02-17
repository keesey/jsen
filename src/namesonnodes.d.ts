///<reference path='./jsen.d.ts' />
declare module jsen.namesonnodes
{
	export var URI: string;

	export interface Taxic
	{
		empty: bool;
	}

	export function decl(solver?: jsen.Solver, uri?: string): jsen.Solver;

	export function unit(): Taxic;
}