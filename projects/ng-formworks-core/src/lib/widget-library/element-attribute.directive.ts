import { Directive, ElementRef, Renderer2, SimpleChanges, input, inject } from "@angular/core";

@Directive({
	selector: "[attributes]",
})
export class ElementAttributeDirective {
	private renderer = inject(Renderer2);
	private elementRef = inject(ElementRef);

	public readonly attributes = input<Record<string, string> | undefined>(undefined);

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes.attributes) {
			for (let attributeName in this.attributes()) {
				const attributeValue = this.attributes()![attributeName];
				if (attributeValue) {
					this.renderer.setAttribute(
						this.elementRef.nativeElement,
						attributeName,
						attributeValue,
					);
				} else {
					this.renderer.removeAttribute(this.elementRef.nativeElement, attributeName);
				}
			}
		}
	}
}
