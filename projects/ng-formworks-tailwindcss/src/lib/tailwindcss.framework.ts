import { Injectable, Type } from '@angular/core';
import type { WidgetLibraryMap } from '@ng-formworks/core';
import { Framework } from '@ng-formworks/core';
import { TailwindFrameworkComponent } from './tailwindcss.component';
import { TwInputComponent } from './widgets/tw-input.widget';
import { TwNumberComponent } from './widgets/tw-number.widget';
import { TwTextareaComponent } from './widgets/tw-textarea.widget';
import { TwSelectComponent } from './widgets/tw-select.widget';
import { TwCheckboxComponent } from './widgets/tw-checkbox.widget';
import { TwCheckboxesComponent } from './widgets/tw-checkboxes.widget';
import { TwRadiosComponent } from './widgets/tw-radios.widget';
import { TwButtonComponent } from './widgets/tw-button.widget';
import { TwSubmitComponent } from './widgets/tw-submit.widget';
import { TwTabsComponent } from './widgets/tw-tabs.widget';
import { TwOneOfComponent } from './widgets/tw-oneof.widget';
import { TwArraySectionComponent } from './widgets/tw-array.widget';
import { TwAddReferenceComponent } from './widgets/tw-add-reference.widget';
import { TwSectionComponent } from './widgets/tw-section.widget';

@Injectable()
export class TailwindFramework extends Framework {
	name = 'tailwindcss';
	text = 'Tailwind CSS';
	framework: Type<unknown> = TailwindFrameworkComponent;

	widgets = {
		...defaultWidgetOverrides(),
	};
}

/** Widget map merged over the core library when this framework is active. */
export function defaultWidgetOverrides(): WidgetLibraryMap {
	return {
		// form controls
		text: TwInputComponent,
		number: TwNumberComponent,
		integer: TwNumberComponent,
		textarea: TwTextareaComponent,
		select: TwSelectComponent,
		checkbox: TwCheckboxComponent,
		file: TwInputComponent,
		// widget sets
		checkboxes: TwCheckboxesComponent,
		'checkboxes-inline': 'checkboxes',
		radios: TwRadiosComponent,
		'radios-inline': 'radios',
		// buttons
		button: TwButtonComponent,
		submit: TwSubmitComponent,
		reset: 'submit',
		// layout
		section: TwSectionComponent,
		array: TwArraySectionComponent,
		$ref: TwAddReferenceComponent,
		tabs: TwTabsComponent,
		tabarray: 'tabs',
		'one-of': TwOneOfComponent,
		optionfieldset: 'one-of',
		selectfieldset: 'one-of',
	};
}
