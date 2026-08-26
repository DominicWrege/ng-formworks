import { Component, inject, input, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { JsonSchemaFormService } from '../json-schema-form.service';
import { buildTitleMap } from '../shared';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'radios-widget',
    template: `
    @if (options?.title) {
      <label
        [attr.for]="'control' + layoutNode()?._id"
        [class]="options?.labelHtmlClass || ''"
        [style.display]="options?.notitle ? 'none' : ''"
      [innerHTML]="$safeNavigationMigration(options?.title)"></label>
    }
    
    <!-- 'horizontal' = radios-inline or radiobuttons -->
    @if (layoutOrientation === 'horizontal') {
      <div
        [class]="options?.htmlClass || ''">
        @for (radioItem of radiosList; track radioItem) {
          <label
            [attr.for]="'control' + layoutNode()?._id + '/' + radioItem?.value"
        [class]="(options?.itemLabelHtmlClass || '') +
          ((controlValue + '' === radioItem?.value + '') ?
          (' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')) :
          (' ' + (options?.style?.unselected || '')))">
            <input type="radio"
              [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
              [attr.readonly]="options?.readonly ? 'readonly' : null"
              [attr.required]="options?.required"
              [checked]="radioItem?.value === controlValue"
              [class]="options?.fieldHtmlClass || ''"
              [disabled]="controlDisabled"
              [id]="'control' + $safeNavigationMigration(layoutNode()?._id) + '/' + $safeNavigationMigration(radioItem?.value)"
              [name]="controlName"
              [value]="$safeNavigationMigration(radioItem?.value)"
              (change)="updateValue($event)">
              <span [innerHTML]="$safeNavigationMigration(radioItem?.name)"></span>
            </label>
          }
        </div>
      }
    
      <!-- 'vertical' = regular radios -->
      @if (layoutOrientation !== 'horizontal') {
        <div>
          @for (radioItem of radiosList; track radioItem) {
            <div
              [class]="options?.htmlClass || ''">
              <label
                [attr.for]="'control' + layoutNode()?._id + '/' + radioItem?.value"
          [class]="(options?.itemLabelHtmlClass || '') +
            ((controlValue + '' === radioItem?.value + '') ?
            (' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')) :
            (' ' + (options?.style?.unselected || '')))">
                <input type="radio"
                  [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
                  [attr.readonly]="options?.readonly ? 'readonly' : null"
                  [attr.required]="options?.required"
                  [checked]="radioItem?.value === controlValue"
                  [class]="options?.fieldHtmlClass || ''"
                  [disabled]="controlDisabled"
                  [id]="'control' + $safeNavigationMigration(layoutNode()?._id) + '/' + $safeNavigationMigration(radioItem?.value)"
                  [name]="controlName"
                  [value]="$safeNavigationMigration(radioItem?.value)"
                  (change)="updateValue($event)">
                  <span [innerHTML]="$safeNavigationMigration(radioItem?.name)"></span>
                </label>
              </div>
            }
          </div>
        }`,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class RadiosComponent implements OnInit,OnDestroy {
  private jsf = inject(JsonSchemaFormService);

  formControl: AbstractControl;
  controlName: string;
  controlValue: any;
  controlDisabled = false;
  boundControl = false;
  options: any;
  layoutOrientation = 'vertical';
  radiosList: any[] = [];
  readonly layoutNode = input<any>(undefined);
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
