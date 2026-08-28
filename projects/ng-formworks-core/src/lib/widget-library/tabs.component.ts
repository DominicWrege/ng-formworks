import {
	ChangeDetectorRef,
	Component,
	OnDestroy,
	OnInit,
	computed,
	inject,
	input,
	linkedSignal,
	signal,
} from "@angular/core";
import { Subscription } from "rxjs";
import type { LayoutNode, WidgetOptions } from "../shared/types";
import { JsonSchemaFormService } from "../json-schema-form.service";
import { FormsModule } from "@angular/forms";
import { SelectFrameworkComponent } from "./select-framework.component";

function canAddTab(items: LayoutNode[], itemCount: number): boolean {
	const lastItem = items[items.length - 1];
	if (lastItem?.type !== "$ref") return true;
	return itemCount < (lastItem.options?.maxItems || 1000);
}

@Component({
	imports: [FormsModule, SelectFrameworkComponent],
	selector: "tabs-widget",
	templateUrl: "./tabs.component.html",
	styles: [
		`
			a {
				cursor: pointer;
			}
			.ngf-hidden {
				display: none;
			}
		`,
	],
})
export class TabsComponent implements OnInit, OnDestroy {
	private jsf = inject(JsonSchemaFormService);
	private cdr = inject(ChangeDetectorRef);

	// Plain getter (not a computed) because JsonSchemaFormService reads
	// ctx.options.title from this component as a legacy plain-field contract
	get options(): WidgetOptions {
		return this.layoutNode()?.options || {};
	}

	// Initialized once from the node's configured tab, then locally writable
	// (select / ngModel); survives layout rebuilds by keeping the previous value
	readonly selectedItem = linkedSignal<LayoutNode | undefined, number>({
		source: () => this.layoutNode(),
		computation: (node, prev) => prev?.value ?? node?.options?.selectedTab ?? 0,
	});

	// Real tab count: starts at items.length - 1 (last item is the $ref
	// "add tab" placeholder) and is bumped when a $ref is materialized
	readonly itemCount = linkedSignal<LayoutNode | undefined, number>({
		source: () => this.layoutNode(),
		computation: (node, prev) => prev?.value ?? Math.max((node?.items?.length ?? 1) - 1, 0),
	});

	readonly showAddTab = computed(() =>
		canAddTab(this.layoutNode()?.items ?? [], this.itemCount()),
	);

	readonly layoutNode = input<LayoutNode | undefined>(undefined);
	readonly layoutIndex = input<number[] | undefined>(undefined);
	readonly dataIndex = input<number[] | undefined>(undefined);
	dataChangesSubs!: Subscription;
	ngOnInit() {
		// TODO(review/test): subscribe only to force change detection when dynamic
		//titles stop updating after their conditional linked field is destroyed
		this.dataChangesSubs = this.jsf.dataChanges.subscribe((val) => {
			this.cdr.markForCheck();
		});
	}

	select(index: number) {
		const layoutNode = this.layoutNode()!;
		if (layoutNode.items![index].type === "$ref") {
			this.itemCount.set(layoutNode.items!.length);
			this.jsf.addItem({
				layoutNode: signal(layoutNode.items![index]),
				layoutIndex: signal(this.layoutIndex()!.concat(index)),
				dataIndex: signal(this.dataIndex()!.concat(index)),
			});
		}
		this.selectedItem.set(index);
	}

	setTabTitle(item: LayoutNode, index: number): string {
		return this.jsf.setArrayItemTitle(this, item, index);
	}

	// Panel inputs must keep stable identities between CD cycles: fresh clones
	// or arrays per cycle would update the panel select-framework-widget's input
	// signals, which rewrites this component's own layout inputs (via the
	// framework component's template) and recomputes tabPanels forever (NG0103)
	readonly tabPanels = computed(() => {
		const node = this.layoutNode();
		const items = node?.items ?? [];
		const dataIndexValue = this.dataIndex() ?? [];
		const layoutIndexValue = this.layoutIndex() ?? [];
		const isArray = node?.dataType === "array";
		return items.map((layoutItem, i) => ({
			layoutItem,
			panelNode: this.buildPanelNode(layoutItem),
			dataIndex: isArray ? this.cachedConcat(dataIndexValue, i) : dataIndexValue,
			layoutIndex: this.cachedConcat(layoutIndexValue, i),
		}));
	});

	// Identity caches backing tabPanels: WeakMap keys are the source nodes/
	// arrays, so entries die with the layout they were built from
	private panelNodeCache = new WeakMap<
		LayoutNode,
		{ optionsRef: unknown; panelNode: LayoutNode }
	>();
	private panelArrayCache = new WeakMap<object, Map<number, number[]>>();

	private cachedConcat(source: number[], index: number): number[] {
		let byIndex = this.panelArrayCache.get(source);
		if (!byIndex) {
			byIndex = new Map();
			this.panelArrayCache.set(source, byIndex);
		}
		let result = byIndex.get(index);
		if (!result) {
			result = [...source, index];
			byIndex.set(index, result);
		}
		return result;
	}

	/** Hide a container's own title/legend when rendering a tab/option panel,
	 *  since the tab label already identifies it and otherwise the heading is
	 *  duplicated. Only container nodes are affected; leaf fields keep labels. */
	protected buildPanelNode(item: LayoutNode): LayoutNode {
		if (!item) return item;
		const isContainer =
			item.dataType === "object" ||
			Array.isArray(item.items) ||
			["section", "fieldset", "div", "flex", "tab", "array"].includes(item.type!);
		if (!isContainer) return item;
		const cached = this.panelNodeCache.get(item);
		if (cached && cached.optionsRef === item.options) return cached.panelNode;
		const panelNode = { ...item, options: { ...(item.options || {}), notitle: true } };
		this.panelNodeCache.set(item, { optionsRef: item.options, panelNode });
		return panelNode;
	}

	ngOnDestroy(): void {
		this.dataChangesSubs?.unsubscribe();
	}
}
