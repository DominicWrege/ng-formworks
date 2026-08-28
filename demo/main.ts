import { enableProdMode, importProvidersFrom, provideZonelessChangeDetection } from "@angular/core";
import {
	bootstrapApplication,
	REMOVE_STYLES_ON_COMPONENT_DESTROY,
} from "@angular/platform-browser";
import { provideHttpClient, withInterceptorsFromDi, withXhr } from "@angular/common/http";
import { JsonSchemaFormModule } from "@ng-formworks/core";
import { TailwindFrameworkModule } from "@ng-formworks/tailwindcss";

import { DemoRootComponent } from "./app/demo-root.component";
import { environment } from "./environments/environment";

if (environment.production) {
	enableProdMode();
}

bootstrapApplication(DemoRootComponent, {
	providers: [
		importProvidersFrom(JsonSchemaFormModule, TailwindFrameworkModule),
		{ provide: REMOVE_STYLES_ON_COMPONENT_DESTROY, useValue: true },
		provideHttpClient(withXhr(), withInterceptorsFromDi()),
		provideZonelessChangeDetection(),
	],
}).catch((err) => console.error(err));
