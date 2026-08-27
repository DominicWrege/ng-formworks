// item-title.component.ts
import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { JsonSchemaFormService } from '../json-schema-form.service';

@Component({
    selector: 'item-title',
    templateUrl: './item-title.component.html',
})
export class ItemTitleComponent implements OnInit, OnChanges,OnDestroy {
    @Input() item: any;
    @Input() index: number;
    @Input() ctx: any;

    title: string;
    dataChangesSubs:Subscription;
    private jsf = inject(JsonSchemaFormService);
    private cdr = inject(ChangeDetectorRef);

    ngOnChanges(changes: SimpleChanges): void {
        this.updateTitle();
    }
    ngOnInit() {
        // Calculate the title once on init, or subscribe to changes here
        this.updateTitle();
        this.dataChangesSubs=this.jsf.dataChanges.subscribe((val)=>{
            this.updateTitle();
            this.cdr.markForCheck();
        })
    }

    updateTitle() {
        this.title = this.jsf.setArrayItemTitle(this.ctx, this.item, this.index);
    }
    ngOnDestroy(): void {
        this.dataChangesSubs?.unsubscribe();
      }
}
