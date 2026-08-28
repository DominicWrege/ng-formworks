// item-title.component.ts
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import type { LayoutNode } from '../shared/types';
import { JsonSchemaFormService, type LegacyWidgetContext } from '../json-schema-form.service';

@Component({
    selector: 'item-title',
    templateUrl: './item-title.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemTitleComponent {
    readonly item = input<LayoutNode>(undefined);
    readonly index = input<number>(undefined);
    readonly ctx = input<LegacyWidgetContext>(undefined);

    private jsf = inject(JsonSchemaFormService);
    private dataChanges = toSignal(this.jsf.dataChanges);

    title = computed(() => {
        this.dataChanges();
        return this.jsf.setArrayItemTitle(this.ctx(), this.item(), this.index());
    });
}
