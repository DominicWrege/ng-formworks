import { Component, ChangeDetectionStrategy } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
    selector: 'demo-root',
    templateUrl: './demo-root.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DemoRootComponent {

  env=environment;
  build=this.env.production?"prd":"dev";

 }
