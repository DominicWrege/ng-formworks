import { Component, OnInit, input, inject } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';
import { RootComponent } from './root.component';


@Component({
    imports: [RootComponent],
    selector: 'tab-widget',
    templateUrl: './tab.component.html',
})
export class TabComponent implements OnInit {
  private jsf = inject(JsonSchemaFormService);

  options: any;
  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);

  ngOnInit() {
    this.options = this.layoutNode().options || {};
  }
}
