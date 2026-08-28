import { Component, inject, input, OnDestroy, OnInit } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import type { FormValue, LayoutNode, WidgetOptions } from "../shared/types";
import { JsonSchemaFormService } from "../json-schema-form.service";
import { StopPropagationDirective } from "./stop-propagation.directive";

@Component({
	imports: [StopPropagationDirective],
	selector: "button-widget",
	templateUrl: "./button.component.html",
})
export class ButtonComponent implements OnInit, OnDestroy {
	private jsf = inject(JsonSchemaFormService);

	formControl!: AbstractControl;
	controlName!: string;
	controlValue!: FormValue;
	controlDisabled = false;
	boundControl = false;
	options!: WidgetOptions;
	readonly layoutNode = input<LayoutNode | undefined>(undefined);
	readonly layoutIndex = input<number[] | undefined>(undefined);
	readonly dataIndex = input<number[] | undefined>(undefined);

	ngOnInit() {
		this.options = this.layoutNode()!.options || {};
		this.jsf.initializeControl(this);
	}

	updateValue(event: Event) {
		if (typeof this.options.onClick === "function") {
			this.options.onClick(event);
		} else {
			this.jsf.updateValue(this, (event.target as HTMLInputElement).value);
		}
	}

	ngOnDestroy() {
		this.jsf.updateValue(this, null);
	}
}
