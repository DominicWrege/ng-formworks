import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'no-framework',
    templateUrl: './no-framework.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class NoFrameworkComponent {
  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[] | undefined>(undefined);
  readonly dataIndex = input<number[] | undefined>(undefined);
}
