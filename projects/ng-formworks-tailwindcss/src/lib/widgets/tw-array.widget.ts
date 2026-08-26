import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { SectionComponent, JsonSchemaFormService } from '@ng-formworks/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { injectTw } from '../tw-base';

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
    // tslint:disable-next-line:component-selector
    selector: 'tw-array-widget',
    template: `
    <fieldset
      [class]="options?.htmlClass || 'mb-4'">
      @if (!options.notitle && options.title) {
        <legend class="text-sm font-semibold text-gray-900 mb-1"
                (click)="toggleExpanded()">
          {{ options.title | textTemplate:titleContext }}
        </legend>
      }
      @if (options?.description) {
        <p class="text-sm text-gray-500 mb-2"
           [innerHTML]="options?.description"></p>
      }
      <div class="flex flex-col gap-3"
           cdkDropList
           cdkDropListOrientation="vertical"
           (cdkDropListDropped)="drop($event)">
        @for (row of layoutNode().items; track row; let i = $index) {
          <div
            [cdkDrag]
            [cdkDragDisabled]="!isDraggable(row)"
            [cdkDragStartDelay]="{ touch: 400, mouse: 0 }"
            [class]="tw.arrayRow">
            @if (showWidget(row)) {
              @if (isDraggable(row)) {
                <button type="button"
                        cdkDragHandle
                        aria-label="Drag to reorder"
                        [class]="tw.dragGrip"
                        [attr.title]="'Drag to reorder'">
                  <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor" aria-hidden="true">
                    <circle cx="2.5" cy="3" r="1.4"/><circle cx="7.5" cy="3" r="1.4"/>
                    <circle cx="2.5" cy="8" r="1.4"/><circle cx="7.5" cy="8" r="1.4"/>
                    <circle cx="2.5" cy="13" r="1.4"/><circle cx="7.5" cy="13" r="1.4"/>
                  </svg>
                </button>
              }
               <div class="flex-1 min-w-0">
                <select-framework-widget
                  [dataIndex]="rowCtx(row, i).dataIndex()"
                  [layoutIndex]="rowCtx(row, i).layoutIndex()"
                  [layoutNode]="row"></select-framework-widget>
              </div>
              @if (canRemove(row, i)) {
                <button type="button"
                        (click)="removeRow(row, i)"
                        aria-label="Remove item"
                        [class]="tw.removeItemBtn">
                  <svg width="10" height="10" viewBox="0 0 10 10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true">
                    <path d="M1 1 L9 9 M9 1 L1 9"/>
                  </svg>
                </button>
              }
            }
          </div>
        }
      </div>
    </fieldset>`,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
})
export class TwArraySectionComponent extends SectionComponent {
  readonly tw = injectTw();
  protected readonly twJsf = inject(JsonSchemaFormService);

  /** Layout-tree context for one row, WidgetContext shape (signal accessors). */
  rowCtx(row: any, i: number): any {
    const dataIndexValue = this.dataIndex() || [];
    const layoutIndexValue = this.layoutIndex() || [];
    return {
      layoutNode: () => row,
      layoutIndex: () => [...layoutIndexValue, i],
      dataIndex: () => (row.arrayItem ? [...dataIndexValue, i] : dataIndexValue),
    };
  }

  showWidget(row: any): boolean {
    return this.twJsf.evaluateCondition(row, this.dataIndex());
  }

  /** Former css-framework showRemoveButton guard, ported. */
  canRemove(row: any, i: number): boolean {
    if (!row || row.type === '$ref' || !row.arrayItem) { return false; }
    const opts = row.options || {};
    if (opts.removable === false || opts.readonly) { return false; }
    if (row.recursiveReference) { return true; }
    const ctx = this.rowCtx(row, i);
    const parentArray = this.twJsf.getParentNode(ctx);
    if (!parentArray) { return false; }
    // below minItems floor? (parent items include the trailing add slot)
    if (parentArray.items.length - 1 <= (parentArray.options.minItems ?? 0)) { return false; }
    // tuples: only the last real tuple entry may be removed
    return row.arrayItemType === 'list'
      ? true
      : ctx.layoutIndex()[ctx.layoutIndex().length - 1]
          === parentArray.items.length - 2;
  }

  isDraggable(row: any): boolean {
    return !!row && row.arrayItem && row.type !== '$ref' &&
      row.arrayItemType === 'list' &&
      (row.options || {}).orderable !== false;
  }

  removeRow(row: any, i: number) {
    this.twJsf.removeItem(this.rowCtx(row, i));
  }

  drop(event: CdkDragDrop<any[]>) {
    const srcIdx = event.previousIndex;
    const trgIdx = event.currentIndex;
    if (srcIdx === trgIdx) { return; }
    const target = this.layoutNode().items[trgIdx];
    if (!target) { return; }
    this.twJsf.moveArrayItem(this.rowCtx(target, trgIdx), srcIdx, trgIdx, true);
  }
}
