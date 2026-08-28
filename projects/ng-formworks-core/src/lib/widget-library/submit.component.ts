import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject, input } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { Subscription } from "rxjs";
import type { FormValue, LayoutNode, WidgetOptions } from "../shared/types";
import { JsonSchemaFormService } from "../json-schema-form.service";
import { hasOwn } from "../shared/utility.functions";
import { StopPropagationDirective } from "./stop-propagation.directive";

@Component({
	imports: [StopPropagationDirective],
	selector: "submit-widget",
	templateUrl: "./submit.component.html",
})
export class SubmitComponent implements OnInit, OnDestroy {
	private jsf = inject(JsonSchemaFormService);
	private cdr = inject(ChangeDetectorRef);

	formControl!: AbstractControl;
	controlName!: string;
	controlValue: FormValue;
	controlDisabled = false;
	boundControl = false;
	options!: WidgetOptions;
	readonly layoutNode = input<LayoutNode | undefined>(undefined);
	readonly layoutIndex = input<number[] | undefined>(undefined);
	readonly dataIndex = input<number[] | undefined>(undefined);

	isValidChangesSubs: Subscription | null = null;
	ngOnDestroy(): void {
		this.isValidChangesSubs?.unsubscribe();
		this.isValidChangesSubs = null;
		this.updateValue({ target: { value: null } });
	}

	ngOnInit() {
		this.options = this.layoutNode()!.options || {};
		this.jsf.initializeControl(this);
		if (hasOwn(this.options, "disabled")) {
			this.controlDisabled = this.options.disabled!;
		} else if (this.jsf.formOptions.disableInvalidSubmit) {
			this.controlDisabled = !this.jsf.isValid;
			this.isValidChangesSubs = this.jsf.isValidChanges.subscribe((isValid) => {
				this.controlDisabled = !isValid;
				this.cdr.markForCheck();
			});
		}
		if (this.controlValue === null || this.controlValue === undefined) {
			this.controlValue = this.options.title;
		}
	}

	updateValue(event: { target: { value: string | null } }) {
		if (typeof this.options.onClick === "function") {
			this.options.onClick(event);
		} else {
			this.jsf.updateValue(this, event.target.value);
		}
	}
}
