import { Component, ChangeDetectionStrategy } from '@angular/core';
import { OneOfComponent } from '@ng-formworks/core';
import { injectTw } from '../tw-base';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'tw-one-of-widget',
    template: `
    @if (this.options?.description) {
      <p [class]="tw.helpText" [innerHTML]="this.options?.description"></p>
    }
    <tw-tabs-widget #tabs [layoutNode]="layoutNode()"
    [layoutIndex]="layoutIndex()"
    [dataIndex]="dataIndex()">
    </tw-tabs-widget>`,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TwOneOfComponent extends OneOfComponent {
  readonly tw = injectTw();
}
