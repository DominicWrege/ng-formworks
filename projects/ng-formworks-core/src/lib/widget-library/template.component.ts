import { Component, ComponentRef, OnChanges, OnDestroy, OnInit, Type, ViewContainerRef, inject, input, viewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import type { LayoutNode } from '../shared/types';
import { JsonSchemaFormService } from '../json-schema-form.service';


@Component({
    selector: 'template-widget',
    templateUrl: './template.component.html',
})
export class TemplateComponent implements OnInit, OnChanges, OnDestroy {
  private jsf = inject(JsonSchemaFormService);
  private dataChangesSubs: Subscription;

  newComponent: ComponentRef<unknown> | null = null;
  readonly layoutNode = input<LayoutNode | undefined>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);
  readonly widgetContainer = viewChild('widgetContainer', { read: ViewContainerRef });

  ngOnInit() {
    this.updateComponent();
    // OnPush bridge: the created custom component has no reactive link to
    // form data changes, so re-mark it whenever form data changes
    this.dataChangesSubs = this.jsf.dataChanges.subscribe(() => {
      this.newComponent?.hostView.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.dataChangesSubs?.unsubscribe();
  }

  ngOnChanges() {
    this.updateComponent();
  }

  updateComponent() {
    const layoutNode = this.layoutNode();
    const widgetContainer = this.widgetContainer();
    if (widgetContainer && !this.newComponent && layoutNode.options.template) {
      this.newComponent = widgetContainer.createComponent((layoutNode.options.template) as Type<unknown>
      );
    }
    if (this.newComponent) {
      for (const input of ['layoutNode', 'layoutIndex', 'dataIndex']) {
        (this.newComponent.instance as Record<string, unknown>)[input] =
          (this as unknown as Record<string, unknown>)[input];
      }
    }
  }
}
