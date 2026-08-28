import { CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, inject, input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { memoize } from '../shared';
import type { LayoutNode, WidgetOptions } from '../shared/types';
import { Subscription } from 'rxjs';
import { JsonSchemaFormService, type WidgetContext } from '../json-schema-form.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SelectFrameworkComponent } from './select-framework.component';
@Component({
  imports: [DragDropModule, SelectFrameworkComponent],
  selector: 'root-widget',
  templateUrl: './root.component.html',
  styles: [`
    [draggable=true] {
      transition: all 150ms cubic-bezier(.4, 0, .2, 1);
    }
    [draggable=true]:hover {
      cursor: move;
      box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
      position: relative; z-index: 10;
      margin-top: -1px;
      margin-left: -1px;
      margin-right: 1px;
      margin-bottom: 1px;
    }
    [draggable=true].drag-target-top {
      box-shadow: 0 -2px 0 #000;
      position: relative; z-index: 20;
    }
    [draggable=true].drag-target-bottom {
      box-shadow: 0 2px 0 #000;
      position: relative; z-index: 20;
    }
    .flex-inherit{
      display:inherit;
      flex-flow:inherit;
      flex-wrap:inherit;
      flex-direction:inherit;
      gap: 0.75rem;
      width:100%
    }
  `],
})
export class RootComponent implements OnInit, OnDestroy,OnChanges {

  private jsf = inject(JsonSchemaFormService);
  private cdr = inject(ChangeDetectorRef);
  options!: WidgetOptions;
  readonly dataIndex = input<number[] | undefined>(undefined);
  readonly layoutIndex = input<number[] | undefined>(undefined);
  readonly layout = input<LayoutNode[] | undefined>(undefined);
  readonly isOrderable = input<boolean | undefined>(undefined);
  readonly isFlexItem = input(false);
  readonly memoizationEnabled= input<boolean>(true);

  dataChangesSubs!: Subscription;

  drop(event: CdkDragDrop<LayoutNode[]>) {
    // most likely why this event is used is to get the dragging element's current index
    let srcInd=event.previousIndex;
    let trgInd=event.currentIndex;
    let layoutItem=this.layout()![trgInd];
    let dataInd=layoutItem?.arrayItem ? (this.dataIndex() || []).concat(trgInd) : (this.dataIndex() || []);
    let layoutInd=(this.layoutIndex() || []).concat(trgInd)
    let itemCtx:WidgetContext={
      dataIndex:()=>{return dataInd},
      layoutIndex:()=>{return layoutInd},
      layoutNode:()=>{return layoutItem},
    }
    this.jsf.moveArrayItem(itemCtx, srcInd, trgInd,true);
  }

  isDraggable(node: LayoutNode): boolean {
    let result=node.arrayItem && node.type !== '$ref' &&
    node.arrayItemType === 'list' && this.isOrderable() !== false
    && node.type !=='submit'
    return result as boolean;
  }

  // TODO: also need to think of other types such as button which can be
  //created by an arbitrary layout
  isFixed(node: LayoutNode): boolean {
    let result=node.type == '$ref';
    return result;
  }

  /**
   * Predicate function that disallows '$ref' item sorts
   * NB declared as a var instead of a function 
   * like sortPredicate(index: number, item: CdkDrag<number>){..}
   * since 'this' is bound to the draglist and doesn't reference the
   * FlexLayoutRootComponent instance
   */
    // TODO: also need to think of other types such as button which can be
    //created by an arbitrary layout
    //might not be needed added condition to [cdkDragDisabled]
    sortPredicate=(index: number, item: CdkDrag<number>)=> {
      let layoutItem=this.layout()![index];
      let result=this.isDraggable(layoutItem);
      //layoutItem.type != '$ref';
      return result;
    }

  // Set attributes for flexbox child
  // (container attributes are set in section.component)
  getFlexAttribute(node: LayoutNode, attribute: string) {
    const index = ['flex-grow', 'flex-shrink', 'flex-basis'].indexOf(attribute);
    return ((node.options || {}).flex || '').split(/\s+/)[index] ||
      (node.options || {})[attribute] || ['1', '1', 'auto'][index];
  }

  //private selectframeworkInputCache = new Map<string, { dataIndex: any[], layoutIndex: any[], layoutNode: any }>();

  // TODO(review): caching — if form field values change, the changes are not propagated

  /*
  getSelectFrameworkInputs(layoutItem: any, i: number) {
    // Create a unique key based on the layoutItem and index
    const cacheKey = `${layoutItem._id}-${i}`;
  
    // If the result is already in the cache, return it
    if(this.enableCaching){
      if (this.selectframeworkInputCache.has(cacheKey)) {
        return this.selectframeworkInputCache.get(cacheKey);
      }
    }


    // If not cached, calculate the values (assuming dataIndex() and layoutIndex() are functions)
    const dataIndex = layoutItem?.arrayItem ? (this.dataIndex() || []).concat(i) : (this.dataIndex() || []);
    const layoutIndex = (this.layoutIndex() || []).concat(i);

    // Save the result in the cache
    const result = { dataIndex, layoutIndex, layoutNode: layoutItem };
    if(this.enableCaching){
      this.selectframeworkInputCache.set(cacheKey, result);
    }

    return result;
  }
    */

  private _getSelectFrameworkInputsRaw = (layoutItem: LayoutNode, i: number) => {
    const dataIndexValue = this.dataIndex() || [];
    const layoutIndexValue = this.layoutIndex() || [];

    return {
      layoutNode: layoutItem,
      layoutIndex: [...layoutIndexValue, i],
      dataIndex: layoutItem?.arrayItem ? [...dataIndexValue, i] : dataIndexValue,
    };
  };

  // Define a separate function to hold the memoized version
  private _getSelectFrameworkInputsMemoized = memoize(
    this._getSelectFrameworkInputsRaw,
    (layoutItem: LayoutNode, i: number) => {
      const layoutItemKey = layoutItem?.id ?? JSON.stringify(layoutItem);
      return `${layoutItemKey}-${i}`;
    }
  );

  // This is the public function that the template calls
  getSelectFrameworkInputs(layoutItem: LayoutNode, i: number) {
    if (this.memoizationEnabled()) {
      return this._getSelectFrameworkInputsMemoized(layoutItem, i);
    } else {
      return this._getSelectFrameworkInputsRaw(layoutItem, i);
    }
  }
  // TODO: investigate — using this trackByFn in the template caused a layout issue,
  // so it is currently unused
  trackByFn(index: number, item: LayoutNode): string | number {
    return item._id ?? index;
  }

  

  /*
  ngOnChanges(changes: SimpleChanges): void {
    // If any of the input properties change, clear the cache
    if (changes.dataIndex || changes.layoutIndex || changes.layout) {
      this.selectframeworkInputCache?.clear(); // Clear the entire cache
    }
  }
  */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['layout'] || changes['dataIndex'] || changes['layoutIndex']) {
      // Clear the entire cache of the memoized function
      this._showWidgetMemoized.cache.clear(); // Clear cache for showWidget
      this._getSelectFrameworkInputsMemoized.cache.clear();
      this.cdr.markForCheck();
    }
  }


// Memoize the showWidget to avoid unnecessary recalculations
private _showWidgetRaw = (layoutNode: LayoutNode): boolean => {
  return this.jsf.evaluateCondition(layoutNode, this.dataIndex()!);
};

private _showWidgetMemoized = memoize(
  this._showWidgetRaw,
  (layoutNode: LayoutNode) => {
    // Memoize based on the layoutNode and dataIndex
    return JSON.stringify(layoutNode) + '-' + (this.dataIndex() || []).join('-');
  }
);

// Public function used in the template
showWidget(layoutNode: LayoutNode): boolean {
  if (this.memoizationEnabled()) {
    return this._showWidgetMemoized(layoutNode);
  } else {
    return this._showWidgetRaw(layoutNode);
  }
}
  ngOnInit(): void {
      if(this.memoizationEnabled()){
        this.dataChangesSubs=this.jsf.dataChanges.subscribe((val)=>{
          this._showWidgetMemoized.cache.clear();
          // TODO(review): clearing this cache causes ngOnChanges to run wherever
          //layoutNode is used as an input, so commented out for now
          //this._getSelectFrameworkInputsMemoized.cache.clear();
        this.cdr.markForCheck();
        })
      }

  }
  ngOnDestroy(): void {
      this._getSelectFrameworkInputsMemoized.cache.clear();
      this.dataChangesSubs?.unsubscribe();
  }
  

}
