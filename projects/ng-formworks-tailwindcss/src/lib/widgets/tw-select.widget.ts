import { Component } from '@angular/core';
import { SelectComponent } from '@ng-formworks/core';
import { injectTw, twLabelCls, twFieldCls } from '../tw-base';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    imports: [FormsModule, ReactiveFormsModule],
    selector: 'tw-select-widget',
    templateUrl: './tw-select.widget.html',
})
export class TwSelectComponent extends SelectComponent {
  readonly tw = injectTw();
  labelCls(options: any) { return twLabelCls(this.tw, options); }
  fieldCls(options: any, fc?: any) { return twFieldCls(this.tw, options, 'select', fc); }
}
