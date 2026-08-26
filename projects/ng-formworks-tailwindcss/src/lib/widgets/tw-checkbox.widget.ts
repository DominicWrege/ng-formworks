import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CheckboxComponent } from '@ng-formworks/core';
import { injectTw } from '../tw-base';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'tw-checkbox-widget',
    template: `
    <label
      [attr.for]="'control' + layoutNode()?._id"
      [class]="tw.checkRow + ' ' + (options?.itemLabelHtmlClass || '')">
      @if (boundControl) {
        <input
          [formControl]="formControl"
          [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
        [class]="tw.checkInput + ' ' + (options?.fieldHtmlClass || '')"
          [id]="'control' + $safeNavigationMigration(layoutNode()?._id)"
          [name]="controlName"
          [readonly]="options?.readonly ? 'readonly' : null"
          type="checkbox">
      }
      @if (!boundControl) {
        <input
          [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
          [checked]="isChecked"
        [class]="tw.checkInput + ' ' + (options?.fieldHtmlClass || '')"
          [disabled]="controlDisabled"
          [id]="'control' + $safeNavigationMigration(layoutNode()?._id)"
          [name]="controlName"
          [readonly]="options?.readonly ? 'readonly' : null"
          [value]="controlValue"
          type="checkbox"
          (change)="updateValue($event)">
      }
      @if (options?.title) {
        <span
          [style.display]="options?.notitle ? 'none' : ''"
        [innerHTML]="$safeNavigationMigration(options?.title)"></span>
      }
    </label>`,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TwCheckboxComponent extends CheckboxComponent {
  readonly tw = injectTw();
}
