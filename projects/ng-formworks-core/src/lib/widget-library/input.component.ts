import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { JsonSchemaFormService } from '../json-schema-form.service';
import { ReactiveFormsModule } from '@angular/forms';
import { StopPropagationDirective } from './stop-propagation.directive';
import { ElementAttributeDirective } from './element-attribute.directive';


@Component({
    imports: [ReactiveFormsModule, StopPropagationDirective, ElementAttributeDirective],
    selector: 'input-widget',
    templateUrl: './input.component.html',
})
export class InputComponent implements OnInit, OnDestroy {
  private jsf = inject(JsonSchemaFormService);

  formControl: AbstractControl;
  controlName: string;
  controlValue: string;
  controlDisabled = false;
  boundControl = false;
  options: any;
  autoCompleteList: string[] = [];
  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);

  //needed as templates don't accept something like [attributes]="options?.['x-inputAttributes']"
  get inputAttributes() {
    return this.options?.['x-inputAttributes'];
  }

  ngOnInit() {
    this.options = this.layoutNode().options || {};
    this.jsf.initializeControl(this);
  }

  updateValue(event) {
    this.jsf.updateValue(this, event.target.value);
  }

  ngOnDestroy () {
    //needed to be done in timeout for when dynamic/condition based
    //titles depend on the formControls value but the formControl
    //is also destroyed
    setTimeout(()=>{
      this.jsf.updateValue(this, null);
    })
  }

}
