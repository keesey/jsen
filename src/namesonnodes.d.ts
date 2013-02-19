///<reference path='./jsen.d.ts' />
declare module jsen.namesonnodes
{
	export var URI: string;

	export interface Taxic
	{
		empty: bool;
		map: { [id: string]: bool; };
		units: number;
	}

	export function decl(solver?: jsen.Solver, uri?: string): jsen.Solver;

	export function phylogeny(): any[];
	export function phylogeny(phylogeny: any[]): any[];
	export function phylogeny(nodes: Taxic[], arcs: Taxic[][]): any[];
	export function phylogeny(arcs: Taxic[][]): any[];

	export function unit(): Taxic;

	export function units(): Taxic[];

	export function universal(): Taxic;
}