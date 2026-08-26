import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { BrowserModule, REMOVE_STYLES_ON_COMPONENT_DESTROY } from '@angular/platform-browser';
import { JsonSchemaFormModule } from '@ng-formworks/core';
import { AceEditorDirective } from './ace-editor.directive';
import { DemoRootComponent } from './demo-root.component';
import { DemoComponent } from './demo.component';

@NgModule({
    declarations: [AceEditorDirective, DemoComponent, DemoRootComponent],
    bootstrap: [DemoRootComponent],
    imports: [BrowserModule,
        JsonSchemaFormModule],
    providers: [
        { provide: REMOVE_STYLES_ON_COMPONENT_DESTROY, useValue: true },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideZoneChangeDetection()
    ]
})

export class DemoModule { }
