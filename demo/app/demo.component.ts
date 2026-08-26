import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal, viewChild } from '@angular/core';
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
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class DemoComponent implements OnInit {
  private http = inject(HttpClient);
  private aceHost = viewChild.required('aceHost', { read: AceEditorDirective });

  envVersion = environment.version;
  examples = Examples;
  exampleGroups = Object.keys(Examples);
  selectedExample = signal('');

  schemaText = signal<string>(DEFAULT_SCHEMA);
  parseError = signal('');
  formActive = signal(false);
  formIsValid = signal<boolean | null>(null);
  prettyValidationErrors = signal('');
  validationErrorList = signal<any[]>([]);
  liveFormData = signal<any>({});
  submittedFormData = signal<any>(null);
  jsonFormObject = signal<any>(undefined);

  jsonFormOptions: any = {
    addSubmit: true,
    setSchemaDefaults: true,
    returnEmptyFields: false,
    defaultWidgetOptions: { feedback: true }
  };

  readonly prettyLiveFormData = computed(() => JSON.stringify(this.liveFormData(), null, 2));
  readonly prettySubmittedFormData = computed(() => JSON.stringify(this.submittedFormData(), null, 2));

  ngOnInit() {
    this.generateForm(this.schemaText());
  }

  onExampleSelect(event) {
    const file = event.target.value;
    if (!file || file === this.selectedExample()) {
      return;
    }
    this.selectedExample.set(file);
    this.http
      .get(`assets/example-schemas/${file}.json`, { responseType: 'text' })
      .subscribe({
        next: schema => {
          this.formActive.set(false);
          setTimeout(() => {
            this.aceHost().setText(schema);
            this.generateForm(schema);
          });
        },
        error: () => { }
      });
  }

  resetExampleSelect() {
    this.selectedExample.set('');
  }

  onEditorChange(text: string) {
    this.generateForm(text);
  }

  generateForm(text?: string) {
    if (typeof text === 'string' && text !== this.schemaText()) {
      this.schemaText.set(text);
    }
    let parsed;
    try {
      parsed = JSON.parse(this.schemaText());
    } catch (e) {
      this.parseError.set((e as Error).message);
      return;
    }
    this.parseError.set('');
    this.liveFormData.set({});
    this.submittedFormData.set(null);
    this.formIsValid.set(null);
    this.prettyValidationErrors.set('');
    this.validationErrorList.set([]);
    this.jsonFormObject.set(parsed);
    this.formActive.set(true);
  }

  onChanges(event) {
    this.liveFormData.set(event);
  }

  onSubmit(event) {
    this.submittedFormData.set(event);
  }

  isValid(event) {
    this.formIsValid.set(event === true);
  }

  validationErrors(event) {
    const errors = Array.isArray(event) ? event : Object.values(event || {});
    this.validationErrorList.set(errors);
    this.prettyValidationErrors.set(errors
      .map(error => typeof error === 'string' ? error : error?.message)
      .filter(Boolean)
      .join(', '));
  }
}
