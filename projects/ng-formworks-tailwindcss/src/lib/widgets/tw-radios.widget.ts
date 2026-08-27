import { Component } from '@angular/core';
import { RadiosComponent } from '@ng-formworks/core';
import { injectTw } from '../tw-base';

@Component({
    selector: 'tw-radios-widget',
    templateUrl: './tw-radios.widget.html',
})
export class TwRadiosComponent extends RadiosComponent {
  readonly tw = injectTw();
}
