import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { JsonSchemaFormService } from '../json-schema-form.service';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
    imports: [ReactiveFormsModule],
    selector: 'textarea-widget',
    templateUrl: './textarea.component.html',
})
export class TextareaComponent implements OnInit,OnDestroy {
  private jsf = inject(JsonSchemaFormService);

  formControl: AbstractControl;
  controlName: string;
  controlValue: any;
  controlDisabled = false;
  boundControl = false;
  options: any;
  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);

  ngOnInit() {
    this.options = this.layoutNode().options || {};
    this.jsf.initializeControl(this);
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
