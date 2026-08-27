import { Component } from '@angular/core';
import { InputComponent } from '@ng-formworks/core';
import { injectTw, twLabelCls, twFieldCls } from '../tw-base';
import { ReactiveFormsModule } from '@angular/forms';
import { ElementAttributeDirective } from '@ng-formworks/core';
import { StopPropagationDirective } from '@ng-formworks/core';

@Component({
    imports: [ReactiveFormsModule, ElementAttributeDirective, StopPropagationDirective],
    selector: 'tw-input-widget',
    templateUrl: './tw-input.widget.html',
})
export class TwInputComponent extends InputComponent {
  readonly tw = injectTw();
  labelCls(options: any) { return twLabelCls(this.tw, options); }
  fieldCls(options: any, bucket: 'input', fc?: any) { return twFieldCls(this.tw, options, bucket, fc); }
}
