import { Component } from "@angular/core";
import { SectionComponent } from "@ng-formworks/core";
import { injectTw } from "../tw-base";
import { RootComponent } from "@ng-formworks/core";
import { TextTemplatePipe } from "@ng-formworks/core";

/**
 * Tailwind replacement for the generic 'section' widget (object containers,
 * fieldsets, divs, flex groups, tabs). Keeps the layout/behaviour of the core
 * SectionComponent but applies consistent Tailwind styling to the legend,
 * description and container so it no longer shows unstyled native chrome.
 */
@Component({
	imports: [RootComponent, TextTemplatePipe],
	selector: "tw-section-widget",
	templateUrl: "./tw-section.widget.html",
})
export class TwSectionComponent extends SectionComponent {
	readonly tw = injectTw();
}
