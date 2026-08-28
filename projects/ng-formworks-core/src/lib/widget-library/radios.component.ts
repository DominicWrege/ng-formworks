import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import type { FormValue, LayoutNode, TitleMapItem, WidgetOptions } from '../shared/types';
import { JsonSchemaFormService } from '../json-schema-form.service';
import { buildTitleMap } from '../shared';


@Component({
    selector: 'radios-widget',
    templateUrl: './radios.component.html',
})
export class RadiosComponent implements OnInit,OnDestroy {
  private jsf = inject(JsonSchemaFormService);

  formControl: AbstractControl;
  controlName: string;
  controlValue: FormValue;
  controlDisabled = false;
  boundControl = false;
  options: WidgetOptions;
  layoutOrientation = 'vertical';
  radiosList: TitleMapItem[] = [];
  readonly layoutNode = input<LayoutNode | undefined>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);

  ngOnInit() {
    this.options = this.layoutNode().options || {};
    const layoutNode = this.layoutNode();
    if (layoutNode.type === 'radios-inline' ||
      layoutNode.type === 'radiobuttons'
    ) {
      this.layoutOrientation = 'horizontal';
    }
    this.radiosList = buildTitleMap(
      this.options.titleMap || this.options.enumNames,
      this.options.enum, true
    );
    this.jsf.initializeControl(this);
  }

  updateValue(event) {
    this.jsf.updateValue(this, event.target.value);
  }

  ngOnDestroy () {
    this.jsf.updateValue(this, null);
  }

}
