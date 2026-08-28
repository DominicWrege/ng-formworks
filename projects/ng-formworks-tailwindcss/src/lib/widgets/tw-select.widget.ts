import { Component } from '@angular/core';
import type { WidgetOptions } from '@ng-formworks/core';
import { SelectComponent } from '@ng-formworks/core';
import { injectTw, twLabelCls, twFieldCls, twTitle } from '../tw-base';
import { AbstractControl, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    imports: [FormsModule, ReactiveFormsModule],
    selector: 'tw-select-widget',
    templateUrl: './tw-select.widget.html',
})
export class TwSelectComponent extends SelectComponent {
  readonly tw = injectTw();
  titleHtml(options?: WidgetOptions | null) { return twTitle(options); }
  labelCls(options?: WidgetOptions | null) { return twLabelCls(this.tw, options); }
  fieldCls(options: WidgetOptions | null | undefined, fc?: AbstractControl | null) { return twFieldCls(this.tw, options, 'select', fc); }
}
