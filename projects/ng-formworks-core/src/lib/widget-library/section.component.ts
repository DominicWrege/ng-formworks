import {
	Component,
	OnChanges,
	OnDestroy,
	OnInit,
	SimpleChanges,
	inject,
	input,
} from '@angular/core';
import { Subscription } from 'rxjs';
import type { FormValue, LayoutNode, WidgetOptions } from '../shared/types';
import { JsonSchemaFormService } from '../json-schema-form.service';
import { RootComponent } from './root.component';
import { TextTemplatePipe } from './text-template.pipe';

@Component({
	imports: [RootComponent, TextTemplatePipe],
	selector: 'section-widget',
	templateUrl: './section.component.html',
	styles: [
		`
			.legend {
				font-weight: bold;
			}
			.expandable > legend:before,
			.expandable > label:before {
				content: '▶';
				padding-right: 0.3em;
				font-family: auto;
			}
			.expanded > legend:before,
			.expanded > label:before {
				content: '▼';
				padding-right: 0.2em;
			}
		`,
	],
})
export class SectionComponent implements OnInit, OnDestroy, OnChanges {
	private jsf = inject(JsonSchemaFormService);

	options!: WidgetOptions;
	expanded = true;
	containerType!: string;
	readonly layoutNode = input<LayoutNode | undefined>(undefined);
	readonly layoutIndex = input<number[] | undefined>(undefined);
	readonly dataIndex = input<number[] | undefined>(undefined);

	dataChangesSubs!: Subscription;
	titleContext: { value: FormValue; values: unknown; key: number | string | null } = {
		value: {},
		values: {},
		key: null,
	};
	get sectionTitle() {
		return this.jsf.setItemTitle(this);
	}

	ngOnInit() {
		this.jsf.initializeControl(this);
		this.options = this.layoutNode()!.options || {};
		this.expanded =
			typeof this.options.expanded === 'boolean'
				? this.options.expanded
				: !this.options.expandable;
		switch (this.layoutNode()!.type) {
			case 'fieldset':
			case 'array':
			case 'tab':
			case 'advancedfieldset':
			case 'authfieldset':
			case 'optionfieldset':
			case 'selectfieldset':
				this.containerType = 'fieldset';
				break;
			default: // 'div', 'flex', 'section', 'conditional', 'actions', 'tagsinput'
				this.containerType = 'div';
				break;
		}
		this.updateTitleContext();
		this.dataChangesSubs = this.jsf.dataChanges.subscribe((val) => {
			this.updateTitleContext();
		});
	}

	toggleExpanded() {
		if (this.options.expandable) {
			this.expanded = !this.expanded;
		}
	}

	// Set attributes for flexbox container
	// (child attributes are set in root.component)
	getFlexAttribute(attribute: string) {
		const flexActive: boolean =
			this.layoutNode()!.type === 'flex' ||
			!!this.options.displayFlex ||
			this.options.display === 'flex';
		if (attribute !== 'flex' && !flexActive) {
			return null;
		}
		switch (attribute) {
			case 'is-flex':
				return flexActive;
			case 'display':
				return flexActive ? 'flex' : 'initial';
			case 'flex-direction':
			case 'flex-wrap':
				const index = ['flex-direction', 'flex-wrap'].indexOf(attribute);
				return (
					(this.options['flex-flow'] || '').split(/\s+/)[index] ||
					this.options[attribute] ||
					['column', 'nowrap'][index]
				);
			case 'justify-content':
			case 'align-items':
			case 'align-content':
				return this.options[attribute];
		}
	}

	ngOnChanges(changes: SimpleChanges): void {}

	updateTitleContext() {
		this.titleContext = this.jsf.getItemTitleContext(this);
	}

	ngOnDestroy(): void {
		this.dataChangesSubs?.unsubscribe();
	}
}
