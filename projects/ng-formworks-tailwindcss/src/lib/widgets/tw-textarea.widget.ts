import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TextareaComponent } from '@ng-formworks/core';
import { injectTw, twLabelCls, twFieldCls } from '../tw-base';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'tw-textarea-widget',
    template: `
    <div
      [class]="options?.htmlClass || tw.formGroup">
      @if (options?.title) {
        <label
          [attr.for]="'control' + layoutNode()?._id"
          [class]="labelCls(options)"
          [style.display]="options?.notitle ? 'none' : ''"
        [innerHTML]="$safeNavigationMigration(options?.title)"></label>
      }
      @if (boundControl) {
        <textarea
          [formControl]="formControl"
          [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
          [attr.maxlength]="options?.maxLength"
          [attr.minlength]="options?.minLength"
          [attr.pattern]="options?.pattern"
          [attr.placeholder]="options?.placeholder"
          [attr.readonly]="options?.readonly ? 'readonly' : null"
          [attr.required]="options?.required"
          [class]="fieldCls(options, formControl)"
          [id]="'control' + $safeNavigationMigration(layoutNode()?._id)"
        [name]="controlName"></textarea>
      }
      @if (!boundControl) {
        <textarea
          [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
          [attr.maxlength]="options?.maxLength"
          [attr.minlength]="options?.minLength"
          [attr.pattern]="options?.pattern"
          [attr.placeholder]="options?.placeholder"
          [attr.readonly]="options?.readonly ? 'readonly' : null"
          [attr.required]="options?.required"
          [class]="fieldCls(options)"
          [disabled]="controlDisabled"
          [id]="'control' + $safeNavigationMigration(layoutNode()?._id)"
          [name]="controlName"
          [value]="controlValue"
        (input)="updateValue($event)">{{controlValue}}</textarea>
      }
    </div>`,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TwTextareaComponent extends TextareaComponent {
  readonly tw = injectTw();
  labelCls(options: any) { return twLabelCls(this.tw, options); }
  fieldCls(options: any, fc?: any) { return twFieldCls(this.tw, options, 'textarea', fc); }
}
