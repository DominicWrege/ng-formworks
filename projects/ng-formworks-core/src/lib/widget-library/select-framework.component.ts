import {
	Component,
	ComponentRef,
	OnDestroy,
	OnInit,
	ViewContainerRef,
	effect,
	inject,
	input,
	viewChild,
} from "@angular/core";
import { Subscription } from "rxjs";

import type { LayoutNode } from "../shared/types";
import { JsonSchemaFormService } from "../json-schema-form.service";

@Component({
	selector: "select-framework-widget",
	templateUrl: "./select-framework.component.html",
})
export class SelectFrameworkComponent implements OnInit, OnDestroy {
	private jsf = inject(JsonSchemaFormService);
	private dataChangesSubs!: Subscription;
	// Last values pushed into the created component; skipping writes for
	// unchanged references avoids re-marking the child dirty on every cycle
	private lastInputs = new Map<string, unknown>();
	newComponent: ComponentRef<unknown> | null = null;
	readonly layoutNode = input<LayoutNode | undefined>(undefined);
	readonly layoutIndex = input<number[] | undefined>(undefined);
	readonly dataIndex = input<number[] | undefined>(undefined);
	readonly widgetContainer = viewChild("widgetContainer", { read: ViewContainerRef });

	constructor() {
		// Creates the framework component once the container is available and
		// re-syncs its inputs whenever the layout inputs change (replaces the
		// former ngOnInit/ngOnChanges updateComponent() calls)
		effect(() => this.updateComponent());
	}

	private updateComponent() {
		const widgetContainer = this.widgetContainer();
		if (!widgetContainer || !this.jsf.framework) return;
		if (!this.newComponent) {
			this.newComponent = widgetContainer.createComponent(this.jsf.framework);
			this.lastInputs.clear();
		}
		const names = ["layoutNode", "layoutIndex", "dataIndex"] as const;
		const self = this as unknown as Record<string, () => unknown>;
		for (const name of names) {
			const value = self[name]();
			if (this.lastInputs.get(name) === value) continue;
			this.lastInputs.set(name, value);
			this.newComponent.setInput(name, value);
		}
	}

	ngOnInit() {
		// OnPush bridge: the created framework component has no reactive link to
		// form data changes, so re-mark it whenever form data changes
		this.dataChangesSubs = this.jsf.dataChanges.subscribe(() => {
			this.newComponent?.hostView.markForCheck();
		});
	}

	ngOnDestroy(): void {
		this.dataChangesSubs?.unsubscribe();
	}
}
