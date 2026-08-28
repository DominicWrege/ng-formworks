import { Component, inject, input } from "@angular/core";
import type { LayoutNode } from "@ng-formworks/core";
import { JsonSchemaFormService } from "@ng-formworks/core";
import { SelectWidgetComponent } from "@ng-formworks/core";

/**
 * Root component for the tailwindcss framework.
 * Thin passthrough (same as no-framework): layout selection is done by
 * select-widget-widget; all styling lives in the widget overrides.
 */
@Component({
	imports: [SelectWidgetComponent],
	selector: "tailwindcss-framework",
	templateUrl: "./tailwindcss.component.html",
})
export class TailwindFrameworkComponent {
	jsf = inject(JsonSchemaFormService);

	readonly layoutNode = input<LayoutNode | undefined>(undefined);
	readonly layoutIndex = input<number[] | undefined>(undefined);
	readonly dataIndex = input<number[] | undefined>(undefined);
}
