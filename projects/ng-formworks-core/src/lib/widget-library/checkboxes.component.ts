import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import type { FormValue, LayoutNode, WidgetOptions } from '../shared/types';
import { JsonSchemaFormService, TitleMapItem } from '../json-schema-form.service';
import { buildTitleMap } from '../shared';


@Component({
    selector: 'checkboxes-widget',
    templateUrl: './checkboxes.component.html',
})
export class CheckboxesComponent implements OnInit,OnDestroy {
  private jsf = inject(JsonSchemaFormService);

  formControl!: AbstractControl;
  controlName!: string;
  controlValue: FormValue;
  controlDisabled = false;
  boundControl = false;
  options!: WidgetOptions;
  layoutOrientation!: string;
  formArray!: AbstractControl;
  checkboxList: TitleMapItem[] = [];
  readonly layoutNode = input<LayoutNode | undefined>(undefined);
  readonly layoutIndex = input<number[] | undefined>(undefined);
  readonly dataIndex = input<number[] | undefined>(undefined);

  ngOnInit() {
    this.options = this.layoutNode()!.options || {};
    const layoutNode = this.layoutNode()!;
    this.layoutOrientation = (layoutNode.type === 'checkboxes-inline' ||
      layoutNode.type === 'checkboxbuttons') ? 'horizontal' : 'vertical';
    this.jsf.initializeControl(this);
    this.checkboxList = buildTitleMap(
      this.options.titleMap || this.options.enumNames || null, this.options.enum, true
    );
    if (this.boundControl) {
      const formArray = this.jsf.getFormControl(this);
      this.checkboxList.forEach(checkboxItem =>
        checkboxItem.checked = formArray.value.includes(checkboxItem.value)
      );
    }
  }

  updateValue(event: { target: { value: string | null; checked: boolean } }) {
    for (const checkboxItem of this.checkboxList) {
      if (event.target.value === checkboxItem.value) {
        checkboxItem.checked = event.target.checked;
      }
    }
    if (this.boundControl) {
      this.jsf.updateArrayCheckboxList(this, this.checkboxList);
    }
  }

  // TODO(review): resetting the control to an empty value here may not be needed
  ngOnDestroy () {
        let nullVal: FormValue[] = [];
        this.formControl.reset(nullVal)
        this.controlValue=null;
  }

}
