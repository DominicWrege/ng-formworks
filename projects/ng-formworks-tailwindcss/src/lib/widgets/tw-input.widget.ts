import { Component } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import type { WidgetOptions } from '@ng-formworks/core';
import { InputComponent } from '@ng-formworks/core';
import { injectTw, twLabelCls, twFieldCls, twTitle } from '../tw-base';
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
  labelCls(options?: WidgetOptions | null) { return twLabelCls(this.tw, options); }
  titleHtml(options?: WidgetOptions | null) { return twTitle(options); }
  fieldCls(options: WidgetOptions | null | undefined, _bucket: 'input', fc?: AbstractControl | null) {
    const bucket = this.layoutNode()?.type === 'color' ? 'colorInput' : 'input';
    return twFieldCls(this.tw, options, bucket, fc);
  }
}
