import { Component } from '@angular/core';
import { AddReferenceComponent } from '@ng-formworks/core';
import { injectTw } from '../tw-base';
import { StopPropagationDirective } from '@ng-formworks/core';

/**
 * Tailwind replacement for the core '$ref' add-slot widget, so the array
 * "add item" button is styled like a real button instead of plain text.
 */
@Component({
	imports: [StopPropagationDirective],
	selector: 'tw-add-reference-widget',
	templateUrl: './tw-add-reference.widget.html',
})
export class TwAddReferenceComponent extends AddReferenceComponent {
	readonly tw = injectTw();
}
