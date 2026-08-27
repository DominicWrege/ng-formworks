import { Component } from '@angular/core';
import { OneOfComponent } from '@ng-formworks/core';
import { injectTw } from '../tw-base';
import { TwTabsComponent } from './tw-tabs.widget';

@Component({
    imports: [TwTabsComponent],
    selector: 'tw-one-of-widget',
    templateUrl: './tw-oneof.widget.html',
})
export class TwOneOfComponent extends OneOfComponent {
  readonly tw = injectTw();
}
