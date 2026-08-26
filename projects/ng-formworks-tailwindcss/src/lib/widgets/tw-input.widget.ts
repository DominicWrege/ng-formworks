import { Component, ChangeDetectionStrategy } from '@angular/core';
import { InputComponent } from '@ng-formworks/core';
import { injectTw, twLabelCls, twFieldCls } from '../tw-base';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'tw-input-widget',
    template: `
    <div [class]="options?.htmlClass || tw.formGroup">
      @if (options?.title) {
        <label
          [attr.for]="'control' + layoutNode()?._id"
          [class]="labelCls(options)"
          [style.display]="options?.notitle ? 'none' : ''"
        [innerHTML]="$safeNavigationMigration(options?.title)"></label>
      }
      @if (boundControl) {
        <input
          [formControl]="formControl"
          [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
          [attr.list]="'control' + layoutNode()?._id + 'Autocomplete'"
          [attr.maxlength]="options?.maxLength"
          [attr.minlength]="options?.minLength"
          [attr.pattern]="options?.pattern"
          [attr.placeholder]="options?.placeholder"
          [attr.required]="options?.required"
          [class]="fieldCls(options, 'input', formControl)"
          [id]="'control' + $safeNavigationMigration(layoutNode()?._id)"
          [name]="controlName"
          [readonly]="options?.readonly ? 'readonly' : null"
          [type]="$safeNavigationMigration(layoutNode()?.type)"
          [attributes]="inputAttributes"
          [appStopPropagation]="['mousedown', 'touchstart']"
          >
      }
      @if (!boundControl) {
        <input
          [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
          [attr.list]="'control' + layoutNode()?._id + 'Autocomplete'"
          [attr.maxlength]="options?.maxLength"
          [attr.minlength]="options?.minLength"
          [attr.pattern]="options?.pattern"
          [attr.placeholder]="options?.placeholder"
          [attr.required]="options?.required"
          [class]="fieldCls(options, 'input')"
          [disabled]="controlDisabled"
          [id]="'control' + $safeNavigationMigration(layoutNode()?._id)"
          [name]="controlName"
          [readonly]="options?.readonly ? 'readonly' : null"
          [type]="$safeNavigationMigration(layoutNode()?.type)"
          [value]="controlValue"
          (input)="updateValue($event)"
          [attributes]="inputAttributes"
          [appStopPropagation]="['mousedown', 'touchstart']"
          >
      }
      @if (options?.typeahead?.source) {
        <datalist
          [id]="'control' + $safeNavigationMigration(layoutNode()?._id) + 'Autocomplete'">
          @for (word of options?.typeahead?.source; track word) {
            <option [value]="word">
            }
          </datalist>
        }
      </div>`,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TwInputComponent extends InputComponent {
  readonly tw = injectTw();
  labelCls(options: any) { return twLabelCls(this.tw, options); }
  fieldCls(options: any, bucket: 'input', fc?: any) { return twFieldCls(this.tw, options, bucket, fc); }
}
