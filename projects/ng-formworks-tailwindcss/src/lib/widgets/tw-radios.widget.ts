import { Component } from '@angular/core';
import type { WidgetOptions } from '@ng-formworks/core';
import { RadiosComponent } from '@ng-formworks/core';
import { injectTw, twTitle } from '../tw-base';

@Component({
    selector: 'tw-radios-widget',
    templateUrl: './tw-radios.widget.html',
})
export class TwRadiosComponent extends RadiosComponent {
  readonly tw = injectTw();
  titleHtml(options?: WidgetOptions | null) { return twTitle(options); }
}
