import { Component } from '@angular/core';
import type { WidgetOptions } from '@ng-formworks/core';
import { CheckboxComponent } from '@ng-formworks/core';
import { injectTw, twTitle } from '../tw-base';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
	imports: [ReactiveFormsModule],
	selector: 'tw-checkbox-widget',
	templateUrl: './tw-checkbox.widget.html',
	styles: [
		`
			/* custom drawn checkbox: white check on the orange fill */
			::ng-deep input[type='checkbox'].jsf-check:checked {
				background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white' stroke-width='3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M4.5 12.75l6 6 9-13.5'/%3E%3C/svg%3E");
				background-position: center;
				background-repeat: no-repeat;
				background-size: 0.875rem;
			}
		`,
	],
})
export class TwCheckboxComponent extends CheckboxComponent {
	readonly tw = injectTw();
	titleHtml(options?: WidgetOptions | null) {
		return twTitle(options);
	}
}
