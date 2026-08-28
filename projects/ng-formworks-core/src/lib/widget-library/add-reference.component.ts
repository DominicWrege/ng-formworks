import { Component, OnInit, inject, input } from '@angular/core';
import type { LayoutNode, WidgetOptions } from '../shared/types';
import { JsonSchemaFormService, type LegacyWidgetContext } from '../json-schema-form.service';
import { StopPropagationDirective } from './stop-propagation.directive';


@Component({
    imports: [StopPropagationDirective],
    selector: 'add-reference-widget',
    templateUrl: './add-reference.component.html',
})
export class AddReferenceComponent implements OnInit {
  private jsf = inject(JsonSchemaFormService);

  options: WidgetOptions;
  itemCount: number;
  previousLayoutIndex: number[];
  previousDataIndex: number[];
  readonly layoutNode = input<LayoutNode | undefined>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);


  ngOnInit() {
    this.options = this.layoutNode().options || {};
  }

  get showAddButton(): boolean {
    return !this.layoutNode().arrayItem ||
      this.layoutIndex()[this.layoutIndex().length - 1] < this.options.maxItems;
  }

  addItem(event) {
    event.preventDefault();
    this.jsf.addItem(this);
  }

  get buttonText(): string {
    const parentNode = this.jsf.getParentNode(this);
    const parent: LegacyWidgetContext = {
      dataIndex: this.dataIndex().slice(0, -1),
      layoutIndex: this.layoutIndex().slice(0, -1),
      layoutNode: parentNode
    };
    return parentNode && (parentNode.add ||
      this.jsf.setArrayItemTitle(parent, this.layoutNode(), this.itemCount));
  }
}
