import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ButtonComponent } from '@ng-formworks/core';
import { injectTw } from '../tw-base';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'tw-button-widget',
    template: `
    <div
      [class]="options?.htmlClass || ''">
      <button
        [attr.readonly]="options?.readonly ? 'readonly' : null"
        [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
        [class]="tw.button + ' ' + (options?.fieldHtmlClass || '')"
        [disabled]="controlDisabled"
        [name]="controlName"
        [type]="$safeNavigationMigration(layoutNode()?.type)"
        [value]="controlValue"
        (click)="updateValue($event)"
        [appStopPropagation]="['mousedown', 'touchstart']"
        >
        @if (options?.icon || options?.title) {
          <span
            class="inline-flex items-center gap-1.5"
            [class]="options?.icon"
          [innerHTML]="$safeNavigationMigration(options?.title)"></span>
        }
      </button>
    </div>`,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TwButtonComponent extends ButtonComponent {
  readonly tw = injectTw();
}
