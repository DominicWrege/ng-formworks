import { InjectionToken, ValueProvider } from "@angular/core";
import { TAILWIND_CFG, TailwindFormClasses } from "./tailwindcss.defs";

/** Orange accent on gray neutrals, light theme. */
export const TAILWIND_DEFAULT_CLASSES: TailwindFormClasses = {
	formGroup: "mb-4",
	label: "block text-sm font-medium text-gray-800 mb-1",
	input:
		"w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 " +
		"placeholder:text-gray-400 shadow-sm focus:border-gray-400 focus:ring-2 " +
		"focus:ring-gray-500/20 focus:outline-none",
	inputInvalid: "border-red-500 focus:border-red-500 focus:ring-red-500/30 text-red-900",
	rangeInput: "w-full accent-gray-600 cursor-pointer",
	colorInput:
		"w-20 rounded-md border border-gray-300 bg-white p-1 shadow-sm cursor-pointer " +
		"focus:border-gray-400 focus:ring-2 focus:ring-gray-500/20 focus:outline-none",
	select:
		"w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 text-sm text-gray-900 " +
		"shadow-sm focus:border-gray-400 focus:ring-2 focus:ring-gray-500/20 focus:outline-none",
	textarea:
		"w-full field-sizing-content min-h-18 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 " +
		"placeholder:text-gray-400 shadow-sm focus:border-gray-400 focus:ring-2 " +
		"focus:ring-gray-500/20 focus:outline-none",
	checkRow: "flex items-center gap-2.5 text-sm text-gray-800",
	checkInput:
		"h-5 w-5 shrink-0 appearance-none rounded-md border border-gray-300 bg-white checked:border-gray-600 checked:bg-gray-600 jsf-check",
	radioInput:
		"h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-full border border-gray-300 bg-white transition-colors checked:border-gray-600 checked:bg-gray-600 checked:bg-[radial-gradient(circle,_white_4px,_transparent_4.5px)]",
	groupVertical: "flex flex-col gap-2.5",
	groupHorizontal: "flex flex-row flex-wrap gap-x-5 gap-y-3 items-center",
	button:
		"cursor-pointer rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white " +
		"shadow-sm hover:bg-orange-700 disabled:opacity-50 disabled:pointer-events-none",
	addBtn:
		"cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 " +
		"shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none",
	helpText: "text-sm text-gray-500 mb-3",
	tabBar: "flex -mb-px border-b border-gray-200 gap-1",
	tab: "block cursor-pointer px-3 py-2 text-sm border-b-2 border-transparent text-gray-500 hover:text-gray-800",
	tabActive: "border-orange-500 text-orange-600 font-medium hover:text-orange-600",
	tabPanel: "",
	arrayRow:
		"relative flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5 shadow-sm transition-colors hover:border-gray-300",
	dragGrip:
		"shrink-0 self-center inline-flex items-center justify-center cursor-grab rounded-md p-1 text-gray-400 transition-colors " +
		"hover:bg-gray-200 hover:text-gray-600 active:cursor-grabbing",
	removeItemBtn:
		"absolute -top-2.5 -right-2.5 inline-flex items-center justify-center cursor-pointer rounded-full bg-white p-1.5 text-gray-400 shadow-sm " +
		"ring-1 ring-gray-200 transition-colors hover:bg-red-50 hover:text-red-600 hover:ring-red-200",
};

/**
 * Optional per-app override of any class bucket.
 * The module always provides a fully-resolved map; missing keys fall back to
 * the orange/gray light defaults.
 */
export function provideTailwindConfig(overrides?: Partial<TailwindFormClasses>): ValueProvider[] {
	return [
		{
			provide: TAILWIND_CFG,
			useValue: { ...TAILWIND_DEFAULT_CLASSES, ...(overrides || {}) },
		},
	];
}
