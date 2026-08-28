import { Component } from "@angular/core";
import { SubmitComponent } from "@ng-formworks/core";
import { injectTw, twFieldCls } from "../tw-base";
import { StopPropagationDirective } from "@ng-formworks/core";

@Component({
	imports: [StopPropagationDirective],
	selector: "tw-submit-widget",
	templateUrl: "./tw-submit.widget.html",
})
export class TwSubmitComponent extends SubmitComponent {
	readonly tw = injectTw();
	get btnCls(): string {
		return twFieldCls(this.tw, this.options, "button");
	}
}
