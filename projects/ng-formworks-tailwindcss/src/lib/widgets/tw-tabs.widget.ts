import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TabsComponent } from '@ng-formworks/core';
import { injectTw } from '../tw-base';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'tw-tabs-widget',
    template: `
    <ul [class]="options?.labelHtmlClass || tw.tabBar">
      @for (item of layoutNode()?.items; track item; let i = $index) {
        <li role="presentation" data-tabs>
          @if (showAddTab || item.type !== '$ref') {
            <a
           [class]="(selectedItem === i ? tw.tabActive : tw.tab) + ' ' + (options?.itemLabelHtmlClass || '')"
              (click)="select(i)">
              @if (options?.tabMode=='oneOfMode') {
                <input type="radio"
                  name="tabSelection"
                  [(ngModel)]="selectedItem"
                  class="mr-1.5 h-4 w-4 accent-orange-600"
                  [value]="i"
                  (change)="select(i)"
                  />
              }
              {{setTabTitle(item, i)}}
            </a>
          }
        </li>
      }
    </ul>

    @for (layoutItem of layoutNode()?.items; track layoutItem; let i = $index) {
      <div
        [class]="((options?.htmlClass || '') + ' ' + tw.tabPanel).trim() + (selectedItem != i ? ' ngf-hidden' : '')">
        @if (options?.tabMode=='oneOfMode') {
          @if (selectedItem === i) {
            <select-framework-widget
              [dataIndex]="layoutNode()?.dataType === 'array' ? (dataIndex() || []).concat(i) : dataIndex()"
              [layoutIndex]="(layoutIndex() || []).concat(i)"
            [layoutNode]="panelNode(layoutItem)"></select-framework-widget>
          }
        }
        @if (options?.tabMode !='oneOfMode') {
          <select-framework-widget
            [dataIndex]="layoutNode()?.dataType === 'array' ? (dataIndex() || []).concat(i) : dataIndex()"
            [layoutIndex]="(layoutIndex() || []).concat(i)"
          [layoutNode]="panelNode(layoutItem)"></select-framework-widget>
        }
      </div>
    }`,
    styles: [` a { cursor: pointer; }
        .ngf-hidden{display:none}
      `],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TwTabsComponent extends TabsComponent {
  readonly tw = injectTw();

  /** Hide a container's own title/legend when rendering a tab/option panel,
   *  since the tab/radio label already identifies it and otherwise the heading
   *  is duplicated. Only container nodes are affected; leaf fields keep labels. */
  panelNode(item: any): any {
    const isContainer = !!item && (
      item.dataType === 'object' ||
      Array.isArray(item.items) ||
      ['section', 'fieldset', 'div', 'flex', 'tab', 'array'].includes(item.type)
    );
    return isContainer
      ? { ...item, options: { ...(item.options || {}), notitle: true } }
      : item;
  }
}
