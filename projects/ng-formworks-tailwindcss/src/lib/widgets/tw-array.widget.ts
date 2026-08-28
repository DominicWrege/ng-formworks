import { Component, inject } from '@angular/core';
import type { LayoutNode, WidgetContext } from '@ng-formworks/core';
import { SectionComponent, JsonSchemaFormService } from '@ng-formworks/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { injectTw } from '../tw-base';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SelectFrameworkComponent } from '@ng-formworks/core';
import { TextTemplatePipe } from '@ng-formworks/core';

/**
 * Tailwind replacement for the 'array' section widget.
 * Adds always-visible corner remove buttons and CDK drag-reorder grips to
 * array item rows, replacing core's invisible root-widget drag behaviour for
 * frameworks that use this override. Behaviour guards mirror the former
 * @ng-formworks/cssframework wrapper:
 *  - removable: options.removable!==false, not readonly, not $ref add-slot,
 *    not below minItems, tuple items only removable when last
 *  - draggable: list items only, orderable not disabled
 */
@Component({
	imports: [DragDropModule, SelectFrameworkComponent, TextTemplatePipe],
	selector: 'tw-array-widget',
	templateUrl: './tw-array.widget.html',
	styles: [
		`
			/* stop the row's own field form-group margin from throwing off vertical centring */
			::ng-deep .jsf-array-cell > * {
				margin-bottom: 0 !important;
			}
		`,
	],
})
export class TwArraySectionComponent extends SectionComponent {
	readonly tw = injectTw();
	protected readonly twJsf = inject(JsonSchemaFormService);

	/** Layout-tree context for one row, WidgetContext shape (signal accessors). */
	rowCtx(row: LayoutNode, i: number): WidgetContext {
		const dataIndexValue = this.dataIndex() || [];
		const layoutIndexValue = this.layoutIndex() || [];
		return {
			layoutNode: () => row,
			layoutIndex: () => [...layoutIndexValue, i],
			dataIndex: () => (row.arrayItem ? [...dataIndexValue, i] : dataIndexValue),
		};
	}

	showWidget(row: LayoutNode): boolean {
		return this.twJsf.evaluateCondition(row, this.dataIndex());
	}

	/** Former css-framework showRemoveButton guard, ported. */
	canRemove(row: LayoutNode, i: number): boolean {
		if (!row || row.type === '$ref' || !row.arrayItem) {
			return false;
		}
		const opts = row.options || {};
		if (opts.removable === false || opts.readonly) {
			return false;
		}
		if (row.recursiveReference) {
			return true;
		}
		const ctx = this.rowCtx(row, i);
		const parentArray = this.twJsf.getParentNode(ctx);
		if (!parentArray) {
			return false;
		}
		// below minItems floor? (parent items include the trailing add slot)
		if (parentArray.items.length - 1 <= (parentArray.options.minItems ?? 0)) {
			return false;
		}
		// tuples: only the last real tuple entry may be removed
		return row.arrayItemType === 'list'
			? true
			: ctx.layoutIndex()[ctx.layoutIndex().length - 1] === parentArray.items.length - 2;
	}

	isDraggable(row: LayoutNode): boolean {
		return (
			!!row &&
			row.arrayItem &&
			row.type !== '$ref' &&
			row.arrayItemType === 'list' &&
			(row.options || {}).orderable !== false
		);
	}

	removeRow(row: LayoutNode, i: number) {
		this.twJsf.removeItem(this.rowCtx(row, i));
	}

	drop(event: CdkDragDrop<LayoutNode[]>) {
		const srcIdx = event.previousIndex;
		const trgIdx = event.currentIndex;
		if (srcIdx === trgIdx) {
			return;
		}
		const target = this.layoutNode().items[trgIdx];
		if (!target) {
			return;
		}
		this.twJsf.moveArrayItem(this.rowCtx(target, trgIdx), srcIdx, trgIdx, true);
	}
}
