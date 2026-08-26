import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { JsonSchemaFormService } from '@ng-formworks/core';

/**
 * Root component for the tailwindcss framework.
 * Thin passthrough (same as no-framework): layout selection is done by
 * select-widget-widget; all styling lives in the widget overrides.
 */
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'tailwindcss-framework',
    template: `
    <select-widget-widget
      [dataIndex]="dataIndex()"
      [layoutIndex]="layoutIndex()"
      [layoutNode]="layoutNode()">
    </select-widget-widget>`,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
})
export class TailwindFrameworkComponent {
  jsf = inject(JsonSchemaFormService);

  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[] | undefined>(undefined);
  readonly dataIndex = input<number[] | undefined>(undefined);
}
