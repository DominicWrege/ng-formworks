import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CheckboxComponent } from '@ng-formworks/core';
import { injectTw } from '../tw-base';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'tw-checkbox-widget',
    template: `
    <div [class]="tw.formGroup">
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
      </label>
    </div>`,
    styles: [`
      /* custom drawn checkbox: white check on the orange fill */
      ::ng-deep input[type="checkbox"].jsf-check:checked {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white' stroke-width='3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M4.5 12.75l6 6 9-13.5'/%3E%3C/svg%3E");
        background-position: center;
        background-repeat: no-repeat;
        background-size: 0.875rem;
      }
    `],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TwCheckboxComponent extends CheckboxComponent {
  readonly tw = injectTw();
}
