import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AddReferenceComponent } from '@ng-formworks/core';
import { injectTw } from '../tw-base';

/**
 * Tailwind replacement for the core '$ref' add-slot widget, so the array
 * "add item" button is styled like a real button instead of plain text.
 */
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'tw-add-reference-widget',
    template: `
    <section [class]="options?.htmlClass || ''" align="end">
      @if (showAddButton) {
        <button
          [class]="tw.button + ' ' + (options?.fieldHtmlClass || '')"
          [disabled]="$safeNavigationMigration(options?.readonly)"
          (click)="addItem($event)"
          [appStopPropagation]="['mousedown', 'touchstart']"
          >
          @if (options?.icon) {
            <span class="inline-flex items-center gap-1.5" [class]="options?.icon"></span>
          }
          @if (options?.title) {
            <span [innerHTML]="buttonText"></span>
          }
        </button>
      }
    </section>`,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TwAddReferenceComponent extends AddReferenceComponent {
  readonly tw = injectTw();
}
