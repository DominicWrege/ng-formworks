import { Directive, ElementRef, OnDestroy, OnInit, Renderer2, input, inject } from '@angular/core';

@Directive({
	selector: '[appStopPropagation]',
})

// TODO(review): stopPropagation used as a workaround
//to prevent dragging onMouseDown and onTouchStart events
export class StopPropagationDirective implements OnInit, OnDestroy {
	private el = inject(ElementRef);
	private renderer = inject(Renderer2);

	// The input property to receive an array of event names
	readonly events = input<string[]>([], { alias: 'appStopPropagation' });

	// An array to hold the unsubscribe functions for each event listener
	private unsubscribeFunctions: Function[] = [];

	ngOnInit() {
		// If the input array is empty, default to 'mousedown'
		const eventsToListen = this.events().length > 0 ? this.events() : ['mousedown'];

		// Loop through the array of event names and set up a listener for each
		eventsToListen.forEach((eventName) => {
			const unsub = this.renderer.listen(this.el.nativeElement, eventName, (event) => {
				event.stopPropagation();
			});
			// Store the unsubscribe function to be called on destruction
			this.unsubscribeFunctions.push(unsub);
		});
	}

	ngOnDestroy() {
		// Call each stored unsubscribe function to clean up listeners
		this.unsubscribeFunctions.forEach((unsub) => unsub());
	}
}
