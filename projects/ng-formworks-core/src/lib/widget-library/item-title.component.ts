// item-title.component.ts
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnDestroy,
	OnInit,
	inject,
	input,
} from "@angular/core";
import { Subscription } from "rxjs";
import type { LayoutNode } from "../shared/types";
import { JsonSchemaFormService, type LegacyWidgetContext } from "../json-schema-form.service";

@Component({
	selector: "item-title",
	templateUrl: "./item-title.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemTitleComponent implements OnInit, OnDestroy {
	readonly item = input<LayoutNode | undefined>(undefined);
	readonly index = input<number | undefined>(undefined);
	readonly ctx = input<LegacyWidgetContext | undefined>(undefined);

	private jsf = inject(JsonSchemaFormService);
	private cdr = inject(ChangeDetectorRef);

	// NB: dataChanges must not be bridged via toSignal/computed here: it is a
	// hot Subject that can emit synchronously during change detection (e.g.
	// widget teardown flushing values), and a mid-refresh signal write re-marks
	// refreshed views (NG0103). markForCheck + a plain getter keeps the
	// original refresh timing (same pattern as section.component's sectionTitle)
	private dataChangesSubs!: Subscription;

	ngOnInit() {
		this.dataChangesSubs = this.jsf.dataChanges.subscribe(() => {
			this.cdr.markForCheck();
		});
	}

	get title() {
		return this.jsf.setArrayItemTitle(this.ctx(), this.item(), this.index());
	}

	ngOnDestroy(): void {
		this.dataChangesSubs?.unsubscribe();
	}
}
