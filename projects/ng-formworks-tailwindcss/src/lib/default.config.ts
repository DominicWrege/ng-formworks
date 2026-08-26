import { InjectionToken, ValueProvider } from '@angular/core';
import { TAILWIND_CFG, TailwindFormClasses } from './tailwindcss.defs';

/** Orange accent on gray neutrals, light theme. */
export const TAILWIND_DEFAULT_CLASSES: TailwindFormClasses = {
    formGroup: 'mb-4',
    label: 'block text-sm font-medium text-gray-800 mb-1',
    input:
        'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ' +
        'placeholder:text-gray-400 shadow-sm focus:border-orange-500 focus:ring-2 ' +
        'focus:ring-orange-500/40 focus:outline-none',
    inputInvalid: 'border-red-500 focus:border-red-500 focus:ring-red-500/30 text-red-900',
    select:
        'w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 text-sm text-gray-900 ' +
        'shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40 focus:outline-none',
    textarea:
        'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ' +
        'placeholder:text-gray-400 shadow-sm focus:border-orange-500 focus:ring-2 ' +
        'focus:ring-orange-500/40 focus:outline-none',
    checkRow: 'flex items-center gap-2 text-sm text-gray-800',
    checkInput: 'h-4 w-4 shrink-0 rounded border-gray-300 accent-orange-600',
    groupVertical: 'flex flex-col gap-2',
    groupHorizontal: 'flex flex-row flex-wrap gap-x-5 gap-y-2 items-center',
    button:
        'cursor-pointer rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white ' +
        'shadow-sm hover:bg-orange-700 disabled:opacity-50 disabled:pointer-events-none',
    helpText: 'text-sm text-gray-500 mb-3',
    tabBar: 'flex -mb-px border-b border-gray-200 gap-1',
    tab: 'block cursor-pointer px-3 py-2 text-sm border-b-2 border-transparent text-gray-500 hover:text-gray-800',
    tabActive: 'border-orange-500 text-orange-600 font-medium hover:text-orange-600',
    tabPanel: '',
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
