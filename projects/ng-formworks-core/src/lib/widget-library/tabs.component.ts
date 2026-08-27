import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject, input, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { JsonSchemaFormService } from '../json-schema-form.service';
import { FormsModule } from '@angular/forms';
import { SelectFrameworkComponent } from './select-framework.component';


@Component({
    imports: [FormsModule, SelectFrameworkComponent],
    selector: 'tabs-widget',
    templateUrl: './tabs.component.html',
    styles: [` a { cursor: pointer; } 
        .ngf-hidden{display:none}
      `],
})
export class TabsComponent implements OnInit,OnDestroy {
  private jsf = inject(JsonSchemaFormService);
  private cdr = inject(ChangeDetectorRef);
  options: any;
  itemCount: number;
  selectedItem = 0;
  showAddTab = true;
  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);
  dataChangesSubs:Subscription;
  ngOnInit() {
    this.options = this.layoutNode().options || {};
    if(this.options.selectedTab){
      this.selectedItem = this.options.selectedTab;
    }
    this.itemCount = this.layoutNode().items.length - 1;
    this.updateControl();
    // TODO(review/test): subscribe only to force change detection when dynamic
    //titles stop updating after their conditional linked field is destroyed
    this.dataChangesSubs=this.jsf.dataChanges.subscribe((val)=>{
      this.cdr.markForCheck();
    })
  }

  select(index) {
    const layoutNode = this.layoutNode();
    if (layoutNode.items[index].type === '$ref') {
      this.itemCount = layoutNode.items.length;
      this.jsf.addItem({
        layoutNode: signal(layoutNode.items[index]),
        layoutIndex: signal(this.layoutIndex().concat(index)),
        dataIndex: signal(this.dataIndex().concat(index))
      });
      this.updateControl();
    }
    this.selectedItem = index;
  }

  updateControl() {
    const lastItem = this.layoutNode().items[this.layoutNode().items.length - 1];
    if (lastItem.type === '$ref' &&
      this.itemCount >= (lastItem.options.maxItems || 1000)
    ) {
      this.showAddTab = false;
    }
  }

  setTabTitle(item: any, index: number): string {
    return this.jsf.setArrayItemTitle(this, item, index);
  }

  /** Hide a container's own title/legend when rendering a tab/option panel,
   *  since the tab label already identifies it and otherwise the heading is
   *  duplicated. Only container nodes are affected; leaf fields keep labels. */
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

  ngOnDestroy(): void {
    this.dataChangesSubs?.unsubscribe();
  }
}
