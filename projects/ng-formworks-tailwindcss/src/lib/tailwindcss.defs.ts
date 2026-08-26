import { InjectionToken } from '@angular/core';

/**
 * Class-string map consumed by all Tailwind widgets.
 * Provide a partial override via `provideTailwindConfig()`; missing keys fall
 * back to the built-in orange/gray light defaults.
 */
export interface TailwindFormClasses {
    /** field wrapper div */
    formGroup: string;
    /** label for title-having fields */
    label: string;
    /** text/number/email-like inputs */
    input: string;
    /** appended to input when the control is invalid && dirty/touched */
    inputInvalid: string;
    /** <select> elements (input + extras applied by widget) */
    select: string;
    /** textarea elements */
    textarea: string;
    /** single checkbox / checkbox+radio item row */
    checkRow: string;
    /** checkbox/radio input element itself */
    checkInput: string;
    /** vertical checkboxes/radios group wrapper */
    groupVertical: string;
    /** horizontal checkboxes/radios group wrapper */
    groupHorizontal: string;
    /** buttons and submit inputs */
    button: string;
    /** muted description/help line, e.g. oneOf chooser hint */
    helpText: string;
    /** tab bar <ul> */
    tabBar: string;
    /** inactive tab link */
    tab: string;
    /** active tab link */
    tabActive: string;
    /** outer panel div of each tab pane */
    tabPanel: string;
}

export const TAILWIND_CFG = new InjectionToken<TailwindFormClasses>('TAILWIND_FORM_CLASSES');
