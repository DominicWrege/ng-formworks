import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import type { FormValue, LayoutNode, WidgetOptions } from '../shared/types';
import { JsonSchemaFormService } from '../json-schema-form.service';
import { ReactiveFormsModule } from '@angular/forms';
import { StopPropagationDirective } from './stop-propagation.directive';
import { ElementAttributeDirective } from './element-attribute.directive';

@Component({
    imports: [ReactiveFormsModule, StopPropagationDirective, ElementAttributeDirective],
    selector: 'number-widget',
    templateUrl: './number.component.html',
})
// TODO: look at reusing InputComponent
export class NumberComponent implements OnInit,OnDestroy {
  private jsf = inject(JsonSchemaFormService);

  formControl: AbstractControl;
  controlName: string;
  controlValue: FormValue;
  controlDisabled = false;
  boundControl = false;
  options: WidgetOptions;
  allowNegative = true;
  allowDecimal = true;
  allowExponents = false;
  lastValidNumber = '';
  readonly layoutNode = input<LayoutNode | undefined>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);

    //needed as templates don't accept something like [attributes]="options?.['x-inputAttributes']"
    get inputAttributes() {
      return this.options?.['x-inputAttributes'];
    }
  @ViewChild('inputControl', {})
  inputControl: ElementRef;

  @ViewChild('divElt', {})
  div: ElementRef;

  ngOnInit() {
    this.options = this.layoutNode().options || {};
    this.jsf.initializeControl(this);
    if (this.layoutNode().dataType === 'integer') { this.allowDecimal = false; }
  }

  updateValue(event) {
    this.jsf.updateValue(this, event.target.value);
  }

  ngOnDestroy () {
    //see cpmments in input component
    setTimeout(()=>{
      this.jsf.updateValue(this, null);
    })
  }
  
}
