import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SubmitComponent } from '@ng-formworks/core';
import { injectTw, twFieldCls } from '../tw-base';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'tw-submit-widget',
    template: `
    <div
      [class]="(tw.formGroup + ' ' + (options?.htmlClass || '')).trim()">
      <input
        [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
        [attr.readonly]="options?.readonly ? 'readonly' : null"
        [attr.required]="options?.required"
        [class]="btnCls"
        [disabled]="controlDisabled"
        [id]="'control' + $safeNavigationMigration(layoutNode()?._id)"
        [name]="controlName"
        [type]="$safeNavigationMigration(layoutNode()?.type)"
        [value]="controlValue"
        (click)="updateValue($event)"
        [appStopPropagation]="['mousedown', 'touchstart']"
        >
    </div>`,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TwSubmitComponent extends SubmitComponent {
  readonly tw = injectTw();
  get btnCls(): string {
    return twFieldCls(this.tw, this.options, 'button');
  }
}
