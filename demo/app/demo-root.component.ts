import { Component, ChangeDetectionStrategy } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'demo-root',
    template: `
  <demo></demo>
  <footer class="pb-4 text-center text-xs text-gray-400">
    ng-formworks v{{env?.version}} &middot; Angular {{env?.angularVersion}} &middot; {{build}}
  </footer>
  `,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DemoRootComponent {

  env=environment;
  build=this.env.production?"prd":"dev";

 }
