import { Component } from '@angular/core';
import { ButtonComponent } from '@ng-formworks/core';
import { injectTw } from '../tw-base';
import { StopPropagationDirective } from '@ng-formworks/core';

@Component({
    imports: [StopPropagationDirective],
    selector: 'tw-button-widget',
    templateUrl: './tw-button.widget.html',
})
export class TwButtonComponent extends ButtonComponent {
  readonly tw = injectTw();
}
