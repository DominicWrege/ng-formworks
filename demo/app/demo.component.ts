import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { environment } from '../environments/environment';
import { Examples } from './example-schemas.model';
import { AceEditorDirective } from './ace-editor.directive';

const DEFAULT_SCHEMA = `{
  "type": "object",
  "title": "Contact",
  "properties": {
    "firstName": { "type": "string", "title": "First name" },
    "lastName": { "type": "string", "title": "Last name" },
    "age": { "type": "integer", "title": "Age" },
    "email": { "type": "string", "format": "email", "title": "Email" }
  },
  "required": ["firstName", "lastName"]
}`;

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'demo',
    templateUrl: 'demo.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DemoComponent implements OnInit {
  private http = inject(HttpClient);
  private aceHost = viewChild.required('aceHost', { read: AceEditorDirective });

  envVersion = environment.version;
  examples = Examples;
  exampleGroups = Object.keys(Examples);
  selectedExample = '';

  schemaText: string = DEFAULT_SCHEMA;
  parseError = '';

  formActive = false;
  formIsValid: boolean = null;
  prettyValidationErrors = '';
  validationErrorList: any[] = [];
  liveFormData: any = {};
  submittedFormData: any = null;

  jsonFormObject: any;

  jsonFormOptions: any = {
    addSubmit: true,
    setSchemaDefaults: true,
    returnEmptyFields: false,
    defaultWidgetOptions: { feedback: true }
  };

  get prettyLiveFormData() {
    return JSON.stringify(this.liveFormData, null, 2);
  }

  get prettySubmittedFormData() {
    return JSON.stringify(this.submittedFormData, null, 2);
  }

  ngOnInit() {
    this.generateForm(this.schemaText);
  }

  onExampleSelect(event) {
    const file = event.target.value;
    if (!file || file === this.selectedExample) {
      return;
    }
    this.selectedExample = file;
    this.http
      .get(`assets/example-schemas/${file}.json`, { responseType: 'text' })
      .subscribe({
        next: schema => {
          this.formActive = false;
          this.schemaText = schema;
          setTimeout(() => {
            this.aceHost().setText(schema);
            this.generateForm(schema);
          });
        },
        error: () => { }
      });
  }

  resetExampleSelect() {
    this.selectedExample = '';
  }

  onEditorChange(text: string) {
    setTimeout(() => this.generateForm(text));
  }

  generateForm(text?: string) {
    if (typeof text === 'string' && text !== this.schemaText) {
      this.schemaText = text;
    }
    let parsed;
    try {
      parsed = JSON.parse(this.schemaText);
    } catch (e) {
      this.parseError = (e as Error).message;
      return;
    }
    this.parseError = '';
    this.liveFormData = {};
    this.submittedFormData = null;
    this.formIsValid = null;
    this.prettyValidationErrors = '';
    this.validationErrorList = [];
    this.jsonFormObject = parsed;
    this.formActive = true;
  }

  private defer(fn: () => void) {
    setTimeout(fn, 0);
  }

  onChanges(event) {
    this.defer(() => { this.liveFormData = event; });
  }

  onSubmit(event) {
    this.defer(() => { this.submittedFormData = event; });
  }

  isValid(event) {
    this.defer(() => { this.formIsValid = event === true; });
  }

  validationErrors(event) {
    this.defer(() => {
      const errors = Array.isArray(event) ? event : Object.values(event || {});
      this.validationErrorList = errors;
      this.prettyValidationErrors = errors
        .map(error => typeof error === 'string' ? error : error?.message)
        .filter(Boolean)
        .join(', ');
    });
  }
}
