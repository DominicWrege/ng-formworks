import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { JsonSchemaFormService } from '../json-schema-form.service';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
    imports: [ReactiveFormsModule],
    selector: 'hidden-widget',
    templateUrl: './hidden.component.html',
})
export class HiddenComponent implements OnInit,OnDestroy {
  private jsf = inject(JsonSchemaFormService);

  formControl: AbstractControl;
  controlName: string;
  controlValue: any;
  controlDisabled = false;
  boundControl = false;
  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);

  ngOnInit() {
    this.jsf.initializeControl(this);
  }

  ngOnDestroy () {
    this.jsf.updateValue(this, null);
  }

}
