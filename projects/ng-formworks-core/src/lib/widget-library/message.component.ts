import { Component, OnInit, input, inject } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';


@Component({
    selector: 'message-widget',
    templateUrl: './message.component.html',
})
export class MessageComponent implements OnInit {
  private jsf = inject(JsonSchemaFormService);

  options: any;
  message: string = null;
  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);

  ngOnInit() {
    this.options = this.layoutNode().options || {};
    this.message = this.options.help || this.options.helpvalue ||
      this.options.msg || this.options.message;
  }
}
