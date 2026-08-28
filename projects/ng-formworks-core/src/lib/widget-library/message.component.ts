import { Component, OnInit, input, inject } from '@angular/core';
import type { LayoutNode, WidgetOptions } from '../shared/types';
import { JsonSchemaFormService } from '../json-schema-form.service';

@Component({
	selector: 'message-widget',
	templateUrl: './message.component.html',
})
export class MessageComponent implements OnInit {
	private jsf = inject(JsonSchemaFormService);

	options!: WidgetOptions;
	message: string = null!;
	readonly layoutNode = input<LayoutNode | undefined>(undefined);
	readonly layoutIndex = input<number[] | undefined>(undefined);
	readonly dataIndex = input<number[] | undefined>(undefined);

	ngOnInit() {
		this.options = this.layoutNode()!.options || {};
		this.message =
			this.options.help || this.options.helpvalue || this.options.msg || this.options.message;
	}
}
