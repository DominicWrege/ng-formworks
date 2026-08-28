import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import type { FormValue, LayoutNode, WidgetOptions } from '../shared/types';
import { JsonSchemaFormService } from '../json-schema-form.service';
import { ReactiveFormsModule } from '@angular/forms';

///NB issue caused by sortablejs when it its destroyed
//this mainly affects checkboxes coupled with conditions
//-the value is rechecked
//-see https://github.com/SortableJS/Sortable/issues/1052#issuecomment-369613072
//-switched to angular cdk for dnd
@Component({
    imports: [ReactiveFormsModule],
    selector: 'checkbox-widget',
    templateUrl: './checkbox.component.html',
})
export class CheckboxComponent implements OnInit,OnDestroy {
  private jsf = inject(JsonSchemaFormService);

  formControl!: AbstractControl;
  controlName!: string;
  controlValue!: FormValue;
  controlDisabled = false;
  boundControl = false;
  options!: WidgetOptions;
  trueValue: FormValue = true;
  falseValue: FormValue = false;
  readonly layoutNode = input<LayoutNode | undefined>(undefined);
  readonly layoutIndex = input<number[] | undefined>(undefined);
  readonly dataIndex = input<number[] | undefined>(undefined);

  ngOnInit() {
    this.options = this.layoutNode()!.options || {};
    this.jsf.initializeControl(this);
    if (this.controlValue === null || this.controlValue === undefined) {
      this.controlValue = false;
      this.jsf.updateValue(this, this.falseValue);
    }
  }

  updateValue(event: Event) {
    event.preventDefault();
    this.jsf.updateValue(this, (event.target as HTMLInputElement).checked ? this.trueValue : this.falseValue);
  }

  get isChecked() {
    return this.jsf.getFormControlValue(this) === this.trueValue;
  }

  ngOnDestroy () {
    this.jsf.updateValue(this, null);
  }

}
