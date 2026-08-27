import { Component } from '@angular/core';
import { TextareaComponent } from '@ng-formworks/core';
import { injectTw, twLabelCls, twFieldCls } from '../tw-base';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    imports: [ReactiveFormsModule],
    selector: 'tw-textarea-widget',
    templateUrl: './tw-textarea.widget.html',
})
export class TwTextareaComponent extends TextareaComponent {
  readonly tw = injectTw();
  labelCls(options: any) { return twLabelCls(this.tw, options); }
  fieldCls(options: any, fc?: any) { return twFieldCls(this.tw, options, 'textarea', fc); }
}
