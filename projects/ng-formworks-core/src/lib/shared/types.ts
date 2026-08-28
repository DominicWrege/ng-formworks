import { Type } from '@angular/core';

/**
 * Shared domain types for ng-formworks.
 *
 * These types describe the three core data structures of a JSON Schema Form:
 * - JsonValue:    any JSON-serializable value (form data)
 * - JsonSchema:   a JSON Schema node (draft 4-2019 compatible subset)
 * - LayoutNode:   a node of the form layout tree
 */

// ---------------------------------------------------------------------------
// JSON values
// ---------------------------------------------------------------------------

export type JsonPrimitive = string | number | boolean | null;

/** Any JSON-serializable value. */
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

/** A JSON object (string keys, JSON-serializable values). */
export interface JsonObject { [key: string]: JsonValue; }

/**
 * Form values as handled at runtime. Before `formatFormData` normalizes them,
 * values may hold non-JSON runtime objects such as `Date`.
 */
export type FormValue = JsonValue | Date | undefined;

/** An open-ended bag of runtime values (e.g. template data, contexts). */
export type DataObject = Record<string, any>;

// ---------------------------------------------------------------------------
// JSON Schema
// ---------------------------------------------------------------------------

export type SchemaTypeName =
  | 'string' | 'number' | 'integer' | 'boolean' | 'null' | 'object' | 'array';

/**
 * A JSON Schema node. Standard draft-4 through draft-2019-09 keywords are
 * typed explicitly; custom keywords (e.g. `x-schema-form`) fall back to the
 * index signature.
 */
export interface JsonSchema {
  $id?: string;
  id?: string;
  $schema?: string;
  $ref?: string;
  $comment?: string;
  type?: SchemaTypeName | SchemaTypeName[];
  title?: string;
  description?: string;
  default?: JsonValue;
  examples?: JsonValue[];
  enum?: JsonValue[];
  const?: JsonValue;

  // numeric keywords
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: number | boolean;
  minimum?: number;
  exclusiveMinimum?: number | boolean;

  // string keywords
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  format?: string;

  // array keywords
  items?: JsonSchema | JsonSchema[];
  additionalItems?: JsonSchema | boolean;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  contains?: JsonSchema;

  // object keywords
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  properties?: { [key: string]: JsonSchema };
  patternProperties?: { [key: string]: JsonSchema };
  additionalProperties?: JsonSchema | boolean;
  propertyNames?: JsonSchema;
  dependencies?: { [key: string]: JsonSchema | string[] };

  // combinators
  allOf?: JsonSchema[];
  anyOf?: JsonSchema[];
  oneOf?: JsonSchema[];
  not?: JsonSchema;
  if?: JsonSchema;
  then?: JsonSchema;
  else?: JsonSchema;

  definitions?: { [key: string]: JsonSchema };

  // UI extensions understood by this library
  'x-schema-form'?: DataObject;
  'ui:order'?: string[];
  widget?: DataObject | string;

  [key: string]:
    | JsonValue
    | JsonSchema
    | JsonSchema[]
    | { [key: string]: JsonSchema }
    | DataObject
    | string[]
    | undefined;
}

// ---------------------------------------------------------------------------
// Widget / layout types
// ---------------------------------------------------------------------------

/** A registered widget: either a component class or the name of another widget (alias). */
export type WidgetType = Type<unknown> | string;

/** A map of widget names to widgets. */
export interface WidgetLibraryMap { [name: string]: WidgetType; }

/** A single entry of a `titleMap` (label/value pairs for select-like widgets). */
export interface TitleMapItem {
  name?: string;
  value?: any;
  checked?: boolean;
  group?: string;
  items?: TitleMapItem[];
}

/** A validation message: a template string or a function rendering the error. */
export type ValidationMessageFn = (error: DataObject) => string;
export type ValidationMessage = string | ValidationMessageFn;

/** Map of error codes to human-readable messages. */
export type ValidationMessages = Record<string, ValidationMessage>;

/** Options merged into every widget (`options` bag of a layout node). */
export interface WidgetOptions {
  title?: string;
  legend?: string;
  description?: string;
  notitle?: boolean;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  condition?: string | ((model: DataObject) => boolean) | DataObject;
  default?: JsonValue;
  enum?: JsonValue[];
  enumNames?: string[];
  titleMap?: TitleMapItem[] | DataObject;
  flatList?: boolean;
  copyValueTo?: string[];
  errorMessage?: string | null;
  showErrors?: boolean;
  validationMessages?: ValidationMessages;

  // array widget options
  listItems?: number;
  tupleItems?: number;
  minItems?: number;
  maxItems?: number;
  addable?: boolean;
  orderable?: boolean;
  removable?: boolean;

  // state / feedback options
  enableErrorState?: boolean;
  disableErrorState?: boolean;
  enableSuccessState?: boolean;
  disableSuccessState?: boolean;
  feedback?: boolean;
  feedbackOnRender?: boolean;
  pristine?: { errors: boolean; success: boolean };

  // style options
  labelHtmlClass?: string;
  fieldHtmlClass?: string;
  fieldStyle?: string;
  [key: string]: any;
}

/** A node of the form layout tree. */
export interface LayoutNode {
  _id?: string | null;
  name?: string | null;
  key?: string;
  type?: string;
  widget?: WidgetType | null;
  items?: LayoutNode[];
  tabs?: LayoutNode[];
  dataPointer?: string;
  dataType?: string | null;
  schemaPointer?: string;
  oneOfPointer?: string;
  anyOfPointer?: string;
  isITEItem?: boolean;
  arrayItem?: boolean;
  arrayItemType?: 'tuple' | 'list' | null;
  $ref?: string;
  recursiveReference?: boolean;
  required?: boolean;
  removable?: boolean;
  value?: FormValue;
  style?: DataObject;
  options?: WidgetOptions;
  [key: string]: any;
}

/** An element of a user-provided layout: a full node, a data pointer or a key. */
export type LayoutItem = LayoutNode | string;
/** A complete form layout. */
export type Layout = LayoutItem[];

// ---------------------------------------------------------------------------
// Form options
// ---------------------------------------------------------------------------

/** Global options configuring the whole form. */
export interface FormOptions {
  autocomplete?: boolean;
  addSubmit?: boolean | 'auto';
  debug?: boolean;
  disableInvalidSubmit?: boolean;
  formDisabled?: boolean;
  formReadonly?: boolean;
  fieldsRequired?: boolean;
  framework?: string;
  loadExternalAssets?: boolean;
  pristine?: { errors: boolean; success: boolean };
  supressPropertyTitles?: boolean;
  setSchemaDefaults?: boolean | 'auto';
  setLayoutDefaults?: boolean | 'auto';
  validateOnRender?: boolean | 'auto';
  widgets?: WidgetLibraryMap;
  defaultWidgetOptions?: WidgetOptions;
  validationDebounceMs?: number;
  returnEmptyFields?: boolean;
  [key: string]: any;
}

// ---------------------------------------------------------------------------
// Validation / errors
// ---------------------------------------------------------------------------

/** Remote errors keyed by control name (see `buildRemoteError`). */
export interface ErrorMessages {
  [control_name: string]: {
    message: string | Function | object;
    code: string;
  }[];
}

/** A dynamic visibility condition attached to a layout node. */
export interface FunctionCondition {
  functionBody?: string;
  functionBodyRaw?: string;
}

// ---------------------------------------------------------------------------
// FormGroup template
// ---------------------------------------------------------------------------

/** The recursive template structure produced by `buildFormGroupTemplate`. */
export interface FormGroupTemplate {
  controlType?: 'FormGroup' | 'FormArray' | 'FormControl' | 'IfThenElse' | '$ref';
  controls?: Record<string, FormGroupTemplate> | FormGroupTemplate[];
  validators?: Record<string, unknown[]>;
  schemaPointer?: string;
  value?: { value: FormValue; disabled: boolean };
  [key: string]: any;
}
