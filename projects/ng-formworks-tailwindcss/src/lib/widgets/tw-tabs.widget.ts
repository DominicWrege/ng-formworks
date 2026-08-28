import { Component } from "@angular/core";
import { TabsComponent } from "@ng-formworks/core";
import { injectTw } from "../tw-base";
import { FormsModule } from "@angular/forms";
import { SelectFrameworkComponent } from "@ng-formworks/core";

@Component({
	imports: [FormsModule, SelectFrameworkComponent],
	selector: "tw-tabs-widget",
	templateUrl: "./tw-tabs.widget.html",
	styles: [
		`
			a {
				cursor: pointer;
			}
			.ngf-hidden {
				display: none;
			}
		`,
	],
})
export class TwTabsComponent extends TabsComponent {
	readonly tw = injectTw();
}
