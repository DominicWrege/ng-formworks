import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import type { FormValue, LayoutNode, TitleMapItem, WidgetOptions } from '../shared/types';
import { JsonSchemaFormService } from '../json-schema-form.service';
import { buildTitleMap, isArray } from '../shared';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  imports: [FormsModule, ReactiveFormsModule],
  selector: 'select-widget',
  templateUrl: './select.component.html',
})
export class SelectComponent implements OnInit, OnDestroy {
  private jsf = inject(JsonSchemaFormService);

  formControl: AbstractControl;
  controlName: string;
  controlValue: FormValue;
  controlDisabled = false;
  boundControl = false;
  options: WidgetOptions;
  selectList: TitleMapItem[] = [];
  selectListFlatGroup: TitleMapItem[] = [];
  isArray = isArray;
  readonly layoutNode = input<LayoutNode | undefined>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);

  ngOnInit() {
    this.options = this.layoutNode().options || {};
    this.selectList = buildTitleMap(
      this.options.titleMap || this.options.enumNames,
      this.options.enum, !!this.options.required, !!this.options.flatList
    );
    //the selectListFlatGroup array will be used to update the formArray values
    //while the selectList array will be bound to the form select
    //as either a grouped select or a flat select
    this.selectListFlatGroup = buildTitleMap(
      this.options.titleMap || this.options.enumNames,
      this.options.enum, !!this.options.required, true
    )
    this.jsf.initializeControl(this);
  }

  deselectAll() {
    this.selectListFlatGroup.forEach(selItem => {
      selItem.checked = false;
    })
  }

  updateValue(event) {
    this.options.showErrors = true;
    if (this.options.multiple) {
      const values = this.controlValue as unknown as unknown[] | null | undefined;
      if (values?.includes(null)) {
        this.deselectAll();
        this.jsf.updateArrayMultiSelectList(this, []);
      } else {
        this.selectListFlatGroup.forEach(selItem => {
          selItem.checked = values?.indexOf(selItem.value) >= 0 ? true : false;
        })
        this.jsf.updateArrayMultiSelectList(this, this.selectListFlatGroup);
      }
      return;
    }
    this.jsf.updateValue(this, this.controlValue);
  }

  ngOnDestroy() {
    let nullVal=this.options.multiple?[null]:null;
    this.formControl.reset(nullVal)
    this.controlValue=null;
  }
}
