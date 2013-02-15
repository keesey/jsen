/* ASSERT */

declare module deepEqual
{
	export function(actual: any, expected: any, message?: string): void;
}

declare module equal
{
	export function(actual: any, expected: any, message?: string): void;
}

declare module notDeepEqual
{
	export function(actual: any, expected: any, message?: string): void;
}

declare module notEqual
{
	export function(actual: any, expected: any, message?: string): void;
}

declare module notStrictEqual
{
	export function(actual: any, expected: any, message?: string): void;
}

declare module ok
{
	export function(state: bool, message?: string): void;
}

declare module strictEqual
{
	export function(actual: any, expected: any, message?: string): void;
}

declare module throws
{
	export function(block: () => any, expected: any, message?: string): void;
	export function(block: () => any, message?: string): void;
}

/* ASYNC CONTROL */

declare module start
{
	export function(decrement?: number): void;
}

declare module stop
{
	export function(increment?: number): void;
}

/* CALLBACKS */

declare module QUnit
{
	export interface DoneDetails
	{
		failed: number;
		passed: number;
		runtime: number;
		total: number;
	}
	export interface LogDetails
	{
		actual: any;
		expected: any;
		message?: string;
		result: bool;
	}
	export interface ModuleDoneDetails
	{
		failed: number;
		name: string;
		passed: number;
		total: number;
	}
	export interface ModuleStartDetails
	{
		name: string;
	}
	export interface TestDoneDetails
	{
		failed: number;
		module: string;
		name: string;
		passed: number;
		total: number;
	}
	export interface TestStartDetails
	{
		module: string;
		name: string;
	}
	export function begin(callback: () => any): void;
	export function done(callback: (details?: DoneDetails) => any): void;
	export function log(callback: (details?: LogDetails) => any): void;
	export function moduleDone(callback: (details?: ModuleDoneDetails) => any): void;
	export function moduleStart(callback: (details?: ModuleStartDetails) => any): void;
	export function testDone(callback: (details?: TestDoneDetails) => any): void;
	export function testStart(callback: (details?: TestStartDetails) => any): void;
}

/* CONFIGURATION */

declare module QUnit.config
{
	export interface URLConfigItem
	{
		id: string;
		label: string;
		tooltip: string;
	}
	export var altertitle: bool;
	export var autostart: bool;
	export var current: any;
	export var reorder: bool;
	export var requireExpects: bool;
	export var urlConfig: URLConfigItem[];
}

/* TEST */

declare module asyncTest
{
	export function(title: string, expected: number, test: () => any): void;
	export function(title: string, test: () => any): void;
}

// Can't do module(); uses a reserved word.

declare module test
{
	export function(title: string, expected: number, test: () => any): void;
	export function(title: string, test: () => any): void;
}

declare module expect
{
	export function(amount: number): void;
}
