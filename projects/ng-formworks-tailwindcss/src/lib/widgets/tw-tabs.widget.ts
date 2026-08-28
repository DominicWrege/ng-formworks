import { Component } from '@angular/core';
import type { LayoutNode } from '@ng-formworks/core';
import { TabsComponent } from '@ng-formworks/core';
import { injectTw } from '../tw-base';
import { FormsModule } from '@angular/forms';
import { SelectFrameworkComponent } from '@ng-formworks/core';

@Component({
    imports: [FormsModule, SelectFrameworkComponent],
    selector: 'tw-tabs-widget',
    templateUrl: './tw-tabs.widget.html',
    styles: [` a { cursor: pointer; }
        .ngf-hidden{display:none}
      `],
})
export class TwTabsComponent extends TabsComponent {
  readonly tw = injectTw();

  /** Hide a container's own title/legend when rendering a tab/option panel,
   *  since the tab/radio label already identifies it and otherwise the heading
   *  is duplicated. Only container nodes are affected; leaf fields keep labels. */
  panelNode(item: LayoutNode): LayoutNode {
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
