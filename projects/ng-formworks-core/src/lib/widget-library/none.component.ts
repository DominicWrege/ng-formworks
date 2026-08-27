import { Component, input } from '@angular/core';

@Component({
    selector: 'none-widget',
    templateUrl: './none.component.html',
})
export class NoneComponent {
  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);
}
