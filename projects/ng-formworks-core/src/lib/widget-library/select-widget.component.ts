import { Component, ComponentRef, OnChanges, OnDestroy, OnInit, SimpleChanges, Type, ViewContainerRef, inject, input, viewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import type { LayoutNode } from '../shared/types';
import { JsonSchemaFormService } from '../json-schema-form.service';

@Component({
    selector: 'select-widget-widget',
    templateUrl: './select-widget.component.html',
})
export class SelectWidgetComponent implements OnChanges, OnInit, OnDestroy {

  private jsf = inject(JsonSchemaFormService);
  private dataChangesSubs!: Subscription;

  newComponent: ComponentRef<unknown> | null = null;
  readonly layoutNode = input<LayoutNode | undefined>(undefined);
  readonly layoutIndex = input<number[] | undefined>(undefined);
  readonly dataIndex = input<number[] | undefined>(undefined);
  readonly widgetContainer = viewChild('widgetContainer', { read: ViewContainerRef });

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

  ngOnChanges(changes:SimpleChanges) {
    this.updateComponent();
  }

  updateComponent() {
    const widgetContainer = this.widgetContainer();
    if (widgetContainer && !this.newComponent && (this.layoutNode() || {}).widget) {
      this.newComponent = widgetContainer.createComponent((this.layoutNode()!.widget) as Type<unknown>
      );
    }
    if (this.newComponent) {
      for (const inp of ['layoutNode', 'layoutIndex', 'dataIndex']) {
        this.newComponent.setInput(inp,(this as unknown as Record<string, () => unknown>)[inp]());
      }
    }
  }
}
