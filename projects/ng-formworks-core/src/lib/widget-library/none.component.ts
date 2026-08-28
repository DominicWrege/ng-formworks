import { Component, input } from '@angular/core';
import type { LayoutNode } from '../shared/types';

@Component({
    selector: 'none-widget',
    templateUrl: './none.component.html',
})
export class NoneComponent {
  readonly layoutNode = input<LayoutNode | undefined>(undefined);
  readonly layoutIndex = input<number[] | undefined>(undefined);
  readonly dataIndex = input<number[] | undefined>(undefined);
}
