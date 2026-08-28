import { Component, OnInit, input, inject } from "@angular/core";
import type { LayoutNode, WidgetOptions } from "../shared/types";
import { JsonSchemaFormService } from "../json-schema-form.service";
import { RootComponent } from "./root.component";

@Component({
	imports: [RootComponent],
	selector: "tab-widget",
	templateUrl: "./tab.component.html",
})
export class TabComponent implements OnInit {
	private jsf = inject(JsonSchemaFormService);

	options!: WidgetOptions;
	readonly layoutNode = input<LayoutNode | undefined>(undefined);
	readonly layoutIndex = input<number[] | undefined>(undefined);
	readonly dataIndex = input<number[] | undefined>(undefined);

	ngOnInit() {
		this.options = this.layoutNode()!.options || {};
	}
}
