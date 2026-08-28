import { inject } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import type { WidgetOptions } from "@ng-formworks/core";
import { TAILWIND_CFG, TailwindFormClasses } from "./tailwindcss.defs";
import { TAILWIND_DEFAULT_CLASSES } from "./default.config";

/** Resolves the app-provided class map, falling back to orange/gray defaults. */
export function injectTw(): TailwindFormClasses {
	return inject(TAILWIND_CFG, { optional: true }) ?? TAILWIND_DEFAULT_CLASSES;
}

/** label classes = cfg.label + user's labelHtmlClass */
export function twLabelCls(tw: TailwindFormClasses, options?: WidgetOptions | null): string {
	const o = options || {};
	return o.labelHtmlClass ? `${tw.label} ${o.labelHtmlClass}` : tw.label;
}

/** widget title html, with a required marker appended for required fields */
export function twTitle(options?: WidgetOptions | null): string {
	const o = options || {};
	const title = String(o.title ?? "");
	return o.required ? `${title}<span class="text-orange-600"> *</span>` : title;
}

/** field classes = bucket + user's fieldHtmlClass (+ invalid state when fc given) */
export function twFieldCls(
	tw: TailwindFormClasses,
	options: WidgetOptions | null | undefined,
	bucket: keyof TailwindFormClasses,
	formControl?: AbstractControl | null,
): string {
	const o = options || {};
	let cls = tw[bucket];
	if (o.fieldHtmlClass) {
		cls += ` ${o.fieldHtmlClass}`;
	}
	if (formControl && formControl.invalid && (formControl.dirty || formControl.touched)) {
		cls += ` ${tw.inputInvalid}`;
	}
	return cls;
}
