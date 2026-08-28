# DONE: `any` → Better Types Refactor (ng-formworks)

The refactor described here is **complete**. All remaining work items from the
original handoff have been finished; all three project builds are green.

## Final state

- `any` occurrences (same `rg -o '\bany\b' --type ts -g '!*.spec.ts' projects demo`
  metric as before, which also counts the word "any" in comments/strings):
  **~540 (start) → 436 (first handoff) → 174 (now)**.
- Verification: `angular-cli_run_target` builds of `@ng-formworks/core`,
  `@ng-formworks/tailwindcss`, and `demo` all succeed (core must be built first;
  the other two resolve `@ng-formworks/core` from `dist/`).
- No runtime behavior changes: only type annotations, targeted casts
  (`as X`, `as unknown as X`), and doc-comment updates. `tsconfig.json` is still
  `strict: false`.

## What was completed in the final pass

1. `widget-library.service.ts` (maps → `WidgetLibraryMap`, `registerWidget`,
   `getWidget(): WidgetType | null`), `framework.ts` (`framework: Type<unknown>`,
   `widgets?: WidgetLibraryMap`), `framework-library.service.ts`
   (`frameworks: Framework[]`, `getFramework(): Type<unknown> | null`, typed
   theme/asset methods), `no-framework`/`tailwindcss` components,
   `tailwindcss.framework.ts`.
2. `json-schema-form.component.ts` (53 → mostly comments): typed all `input()`s
   (`JsonSchema`, `Layout`, `DataObject`, `FormOptions`, `WidgetLibraryMap`,
   ajv `Options`, new `FormInput` interface for the combined `form` input),
   typed all `output()`s, `Provider` for the value accessor, `previousInputs`.
3. `locale/*-validation-messages.ts` → `ValidationMessages` (7 files).
4. Tailwind widgets + `tw-base.ts` (`WidgetOptions`, `AbstractControl`,
   `LayoutNode`, `WidgetContext` for `rowCtx`).
5. All `widget-library/*` components/directives/pipes: `options: WidgetOptions`,
   `layoutNode = input<LayoutNode | undefined>`, `controlValue: FormValue`,
   `TitleMapItem[]` lists, `ComponentRef<unknown>`, etc.
6. `demo/app/ace-editor.directive.ts` → brace's typed `Editor`, typed `@Input`
   setters, `output<string>`.
7. `shared/validator.functions.ts`: guards/params → `unknown`, typed
   `_executeValidators`/`_executeAsyncValidators`/`_mergeObjects`/`_mergeErrors`/
   `toJavaScriptType`/`toSchemaType`/`inArray`/`xor`, `AsyncIValidatorFn` →
   `Promise<PlainObject> | Observable<PlainObject>`.
8. `shared/form-group.functions.ts`: `getControl`/`setControl`/
   `buildFormGroupTemplate(nodeValue: unknown)`/`formatFormData` typed
   (loose dual group/template navigation kept behind a single `Record<string, any>`
   alias); service call sites cast where the shape is known.
9. `shared/jsonpointer.functions.ts`: `parse/compile/toKey/isJsonPointer/
   escape/unescape/has/dict/getFirst/getFirstCopy` typed; `get` stays lodash-style;
   `set/setCopy/remove` keep `as any[]` (keys double as numeric indexes);
   `forEachDeep*` remain explicitly `any` per design.
10. `shared/utility.functions.ts`: generic `copy<T>`, `hasOwn(object: unknown,
    property: string | number)`, typed `addClasses`/`mergeFilteredObject`/
    `uniqueItems`/`commonItems`/`compareObjectArraySizes`, expression helpers typed.
    `forEach`/`forEachCopy` and the experimental `ConditionParser`/
    `ConditionEvaluator`/`ExpressionAnalyzer` classes intentionally left.

## Remaining `any` (deliberate, do not remove without a reason)

- `shared/types.ts` index signatures and `TitleMapItem.value` (escape hatches).
- `JsonSchemaFormService`: `dataErrors`, `dataMap` inner map, `schemaRefLibrary`.
- `native.functions.ts` (`deepEqual`, `cloneDeep` internals, `memoize` args).
- `merge-schemas.function.ts` / `convert-schema-to-draft6.function.ts` dynamic
  switches (aliased reads + TS2367-style escapes).
- `utility.functions.ts` `forEach`/`forEachCopy` callback params and experimental
  private classes; `jsonpointer.functions.ts` `forEachDeep*`.
- `layout.functions.ts` `mapLayout` fn param (`p` must stay `any`), `buildTitleMap`
  `tm`/`ev` aliases (heterogeneous user data).
- `form-group.functions.ts` `controls`/`mergedValues` locals.
- `framework-library.service.ts` `Framework & Record<string, any>` casts.
- English prose comments containing the word "any".
