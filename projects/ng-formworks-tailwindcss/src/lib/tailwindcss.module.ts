import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { JsonSchemaFormModule, WidgetLibraryModule } from '@ng-formworks/core';
import { TailwindFrameworkComponent } from './tailwindcss.component';
import { TailwindFramework } from './tailwindcss.framework';
import { Framework, FrameworkLibraryService, WidgetLibraryService } from '@ng-formworks/core';
import { provideTailwindConfig } from './default.config';
import { TwInputComponent } from './widgets/tw-input.widget';
import { TwNumberComponent } from './widgets/tw-number.widget';
import { TwTextareaComponent } from './widgets/tw-textarea.widget';
import { TwSelectComponent } from './widgets/tw-select.widget';
import { TwCheckboxComponent } from './widgets/tw-checkbox.widget';
import { TwCheckboxesComponent } from './widgets/tw-checkboxes.widget';
import { TwRadiosComponent } from './widgets/tw-radios.widget';
import { TwButtonComponent } from './widgets/tw-button.widget';
import { TwSubmitComponent } from './widgets/tw-submit.widget';
import { TwTabsComponent } from './widgets/tw-tabs.widget';
import { TwOneOfComponent } from './widgets/tw-oneof.widget';
import { TwArraySectionComponent } from './widgets/tw-array.widget';
import { TwAddReferenceComponent } from './widgets/tw-add-reference.widget';
import { TwSectionComponent } from './widgets/tw-section.widget';

/**
 * Registers the `tailwindcss` framework with @ng-formworks/core.
 *
 * Import this module once (usually in the app module). Style overrides can be
 * supplied by adding `provideTailwindConfig({...})` to module providers.
 * Requires the host application to include Tailwind CSS and to let the JIT
 * scanner see this package's dist output, e.g. in a v4 stylesheet:
 *   `@source "../node_modules/@ng-formworks/tailwindcss/dist";`
 */
@NgModule({
	imports: [
		JsonSchemaFormModule,
		WidgetLibraryModule,
		FormsModule,
		ReactiveFormsModule,
		DragDropModule,
		TailwindFrameworkComponent,
		TwInputComponent,
		TwNumberComponent,
		TwTextareaComponent,
		TwSelectComponent,
		TwCheckboxComponent,
		TwCheckboxesComponent,
		TwRadiosComponent,
		TwButtonComponent,
		TwSubmitComponent,
		TwTabsComponent,
		TwOneOfComponent,
		TwArraySectionComponent,
		TwAddReferenceComponent,
		TwSectionComponent,
	],
	exports: [JsonSchemaFormModule],
	providers: [
		...provideTailwindConfig(),
		{ provide: Framework, useClass: TailwindFramework, multi: true },
	],
})
export class TailwindFrameworkModule {}
