import { Component } from '@angular/core';
import type { WidgetOptions } from '@ng-formworks/core';
import { NumberComponent } from '@ng-formworks/core';
import { injectTw, twLabelCls, twFieldCls, twTitle } from '../tw-base';
import { ReactiveFormsModule } from '@angular/forms';
import { ElementAttributeDirective } from '@ng-formworks/core';
import { StopPropagationDirective } from '@ng-formworks/core';

@Component({
	imports: [ReactiveFormsModule, ElementAttributeDirective, StopPropagationDirective],
	selector: 'tw-number-widget',
	templateUrl: './tw-number.widget.html',
})
export class TwNumberComponent extends NumberComponent {
	readonly tw = injectTw();
	labelCls(options?: WidgetOptions | null) {
		return twLabelCls(this.tw, options);
	}
	titleHtml(options?: WidgetOptions | null) {
		return twTitle(options);
	}
	fieldCls(options?: WidgetOptions | null) {
		const bucket = this.layoutNode()?.type === 'range' ? 'rangeInput' : 'input';
		return twFieldCls(this.tw, options, bucket, this.formControl);
	}
}
