import { Component, ChangeDetectionStrategy } from '@angular/core';
import { environment } from '../environments/environment';
import { DemoComponent } from './demo.component';

@Component({
	selector: 'demo-root',
	templateUrl: './demo-root.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	imports: [DemoComponent],
})
export class DemoRootComponent {
	env = environment;
	build = this.env.production ? 'prd' : 'dev';
}
