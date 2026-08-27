import { Component } from '@angular/core';
import { NumberComponent } from '@ng-formworks/core';
import { injectTw, twLabelCls, twFieldCls } from '../tw-base';
import { ReactiveFormsModule } from '@angular/forms';
import { ElementAttributeDirective } from '@ng-formworks/core';
import { StopPropagationDirective } from '@ng-formworks/core';

@Component({
    imports: [ReactiveFormsModule, ElementAttributeDirective, StopPropagationDirective],
    selector: 'tw-number-widget',
    templateUrl: './tw-number.widget.html',
})
export class TwNumberComponent extends NumberComponent {
  readonly tw = injectTw();
  labelCls(options: any) { return twLabelCls(this.tw, options); }
  fieldCls(options: any) { return twFieldCls(this.tw, options, 'input', this.formControl); }
}
