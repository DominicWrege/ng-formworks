import {
	Component,
	ComponentRef,
	OnChanges,
	OnDestroy,
	OnInit,
	SimpleChanges,
	Type,
	ViewContainerRef,
	inject,
	input,
	viewChild,
} from "@angular/core";
import { Subscription } from "rxjs";

import type { LayoutNode } from "../shared/types";
import { JsonSchemaFormService } from "../json-schema-form.service";

@Component({
	selector: "select-widget-widget",
	templateUrl: "./select-widget.component.html",
})
export class SelectWidgetComponent implements OnChanges, OnInit, OnDestroy {
	private jsf = inject(JsonSchemaFormService);
	private dataChangesSubs!: Subscription;
	// Last values pushed into the created widget; skipping writes for unchanged
	// references avoids re-marking the widget dirty on every CD cycle (NG0103)
	private lastInputs = new Map<string, unknown>();

	newComponent: ComponentRef<unknown> | null = null;
	readonly layoutNode = input<LayoutNode | undefined>(undefined);
	readonly layoutIndex = input<number[] | undefined>(undefined);
	readonly dataIndex = input<number[] | undefined>(undefined);
	readonly widgetContainer = viewChild("widgetContainer", { read: ViewContainerRef });

	ngOnInit() {
		this.updateComponent();
		// OnPush bridge: the created widget has no reactive link to form data
		// changes, so re-mark it whenever form data changes
		this.dataChangesSubs = this.jsf.dataChanges.subscribe(() => {
			this.newComponent?.hostView.markForCheck();
		});
	}

	ngOnDestroy(): void {
		this.dataChangesSubs?.unsubscribe();
	}

	ngOnChanges() {
		this.updateComponent();
	}

	updateComponent() {
		const widgetContainer = this.widgetContainer();
		if (widgetContainer && !this.newComponent && (this.layoutNode() || {}).widget) {
			this.newComponent = widgetContainer.createComponent(
				this.layoutNode()!.widget as Type<unknown>,
			);
			this.lastInputs.clear();
		}
		if (this.newComponent) {
			for (const inp of ["layoutNode", "layoutIndex", "dataIndex"]) {
				const value = (this as unknown as Record<string, () => unknown>)[inp]();
				if (this.lastInputs.get(inp) === value) continue;
				this.lastInputs.set(inp, value);
				this.newComponent.setInput(inp, value);
			}
		}
	}
}
