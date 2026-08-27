import { Component, input } from '@angular/core';
import { SelectWidgetComponent } from '../widget-library/select-widget.component';

@Component({
    imports: [SelectWidgetComponent],
    selector: 'no-framework',
    templateUrl: './no-framework.component.html',
})
export class NoFrameworkComponent {
  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[] | undefined>(undefined);
  readonly dataIndex = input<number[] | undefined>(undefined);
}
