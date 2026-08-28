import {
	Directive,
	ElementRef,
	booleanAttribute,
	effect,
	inject,
	input,
	output,
} from "@angular/core";
import ace, { Editor } from "brace";
import "brace/mode/json";
import "brace/theme/sqlserver";

@Directive({
	selector: "[ace-editor]",
	exportAs: "aceEditor",
})
export class AceEditorDirective {
	readonly options = input<Record<string, unknown>>({});
	readonly readOnly = input(false, { transform: booleanAttribute });
	readonly theme = input("sqlserver");
	readonly mode = input("json");
	readonly text = input<string>();
	readonly autoUpdateContent = input(true, { transform: booleanAttribute });
	readonly textChanged = output<string>({ alias: "textChanged" });

	private _initialApplied = false;
	_highlightActiveLine = false;
	_showGutter = false;
	_suppressChange = false;
	editor: Editor;

	constructor() {
		const el = inject(ElementRef).nativeElement;
		this.editor = ace.edit(el);
		this.init();
		this.initEvents();

		effect(() => this.editor.setOptions(this.options() || {}));
		effect(() => this.editor.setReadOnly(this.readOnly()));
		effect(() => this.editor.setTheme(`ace/theme/${this.theme()}`));
		effect(() => this.editor.getSession().setMode(`ace/mode/${this.mode()}`));
		// One-shot initial content; later syncs go through setText() imperatively
		effect(() => {
			const text = this.text();
			if (!this._initialApplied) {
				this._initialApplied = true;
				this.setText(text || "");
			}
		});
	}

	init() {
		this.editor.getSession().setUseWorker(false);
		this.editor.setHighlightActiveLine(this._highlightActiveLine);
		this.editor.renderer.setShowGutter(this._showGutter);
		this.editor.$blockScrolling = Infinity;
	}

	initEvents() {
		this.editor.on("change", () => {
			if (this._suppressChange) {
				return;
			}
			this.textChanged.emit(this.editor.getValue());
		});
	}

	setText(text: string) {
		if (!text) {
			text = "";
		}
		this._suppressChange = true;
		try {
			this.editor.setValue(text);
			this.editor.clearSelection();
			this.editor.moveCursorTo(0, 0);
		} finally {
			queueMicrotask(() => {
				this._suppressChange = false;
			});
		}
	}
}
