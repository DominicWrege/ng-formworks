import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  signal,
  viewChild,
} from '@angular/core';
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

type ParseResult = { ok: true; schema: object } | { ok: false; error: string };

/** Matches the shape of `(validationErrors)` emissions from <json-schema-form>. */
type ValidationIssue = string | { message?: string | null };

interface DemoFormOptions {
  addSubmit: boolean;
  setSchemaDefaults: boolean;
  returnEmptyFields: boolean;
  defaultWidgetOptions: { feedback: boolean };
}

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'demo',
    templateUrl: 'demo.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class DemoComponent {
  private http = inject(HttpClient);
  private aceHost = viewChild('aceHost', { read: AceEditorDirective });

  envVersion = environment.version;
  examples = Examples;
  exampleGroups = Object.keys(Examples);

  readonly selectedExample = signal('');
  readonly loadedSchema = signal<string | null>(null);

  // Editor text: locally writable, auto-resyncs when a new example loads
  readonly schemaText = linkedSignal<string | null, string>({
    source: () => this.loadedSchema(),
    computation: (src, prev) => (src === null ? (prev?.value ?? DEFAULT_SCHEMA) : src),
  });

  readonly parsedSchema = computed<ParseResult>(() => {
    try {
      return { ok: true, schema: JSON.parse(this.schemaText()) as object };
    } catch (e) {
      return { ok: false, error: (e as Error).message };
    }
  });
  readonly parseError = computed(() => {
    const p = this.parsedSchema();
    return p.ok ? '' : p.error;
  });
  readonly jsonFormObject = computed<object | undefined>(() => {
    const p = this.parsedSchema();
    return p.ok ? p.schema : undefined;
  });

  readonly formIsValid = signal<boolean | null>(null);
  readonly validationErrorList = signal<ValidationIssue[]>([]);
  readonly prettyValidationErrors = computed(() =>
    this.validationErrorList()
      .map(error => typeof error === 'string' ? error : error?.message ?? '')
      .filter(Boolean)
      .join(', '));

  readonly liveFormData = signal<unknown>({});
  readonly submittedFormData = signal<unknown>(null);
  readonly prettyLiveFormData = computed(() => JSON.stringify(this.liveFormData(), null, 2));
  readonly prettySubmittedFormData = computed(() => JSON.stringify(this.submittedFormData(), null, 2));

  jsonFormOptions: DemoFormOptions = {
    addSubmit: true,
    setSchemaDefaults: true,
    returnEmptyFields: false,
    defaultWidgetOptions: { feedback: true }
  };

  constructor() {
    // Ace <-> signal bridge: push schemaText into the editor whenever they diverge
    // (linkedSignal resync on example load). User typing never diverges, so this is a no-op then.
    effect(() => {
      const text = this.schemaText();
      const ace = this.aceHost();
      if (ace?.editor && ace.editor.getValue() !== text) {
        ace.setText(text);
      }
    });
  }

  onExampleSelect(event: Event) {
    const file = (event.target as HTMLSelectElement).value;
    if (!file || file === this.selectedExample()) {
      return;
    }
    this.selectedExample.set(file);
    this.http
      .get(`assets/example-schemas/${file}.json`, { responseType: 'text' })
      .subscribe({
        next: schema => this.loadedSchema.set(schema),
        error: () => { }
      });
  }

  onEditorChange(text: string) {
    this.schemaText.set(text);
  }

  onValidationErrors(event: unknown) {
    const issues = Array.isArray(event)
      ? event as ValidationIssue[]
      : Object.values(event ?? {}) as ValidationIssue[];
    this.validationErrorList.set(issues);
  }
}
