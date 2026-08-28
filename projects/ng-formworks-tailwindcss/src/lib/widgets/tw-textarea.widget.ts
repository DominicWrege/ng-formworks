import { Component } from "@angular/core";
import type { WidgetOptions } from "@ng-formworks/core";
import { TextareaComponent } from "@ng-formworks/core";
import { injectTw, twLabelCls, twFieldCls, twTitle } from "../tw-base";
import { AbstractControl, ReactiveFormsModule } from "@angular/forms";

@Component({
	imports: [ReactiveFormsModule],
	selector: "tw-textarea-widget",
	templateUrl: "./tw-textarea.widget.html",
})
export class TwTextareaComponent extends TextareaComponent {
	readonly tw = injectTw();
	titleHtml(options?: WidgetOptions | null) {
		return twTitle(options);
	}
	labelCls(options?: WidgetOptions | null) {
		return twLabelCls(this.tw, options);
	}
	fieldCls(options: WidgetOptions | null | undefined, fc?: AbstractControl | null) {
		return twFieldCls(this.tw, options, "textarea", fc);
	}
}
