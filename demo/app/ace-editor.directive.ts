import { Directive, ElementRef, Input, inject, output } from "@angular/core";
import ace, { Editor } from "brace";
import "brace/mode/json";
import "brace/theme/sqlserver";

@Directive({
	selector: "[ace-editor]",
	exportAs: "aceEditor",
})
export class AceEditorDirective {
	_options: Record<string, unknown> = {};
	_highlightActiveLine = false;
	_showGutter = false;
	_readOnly = false;
	_theme = "sqlserver";
	_mode = "json";
	_autoUpdateContent = true;
	_suppressChange = false;
	editor: Editor;
	oldText: string;
	readonly textChanged = output<string>({ alias: "textChanged" });

	constructor() {
		const elementRef = inject(ElementRef);

		const el = elementRef.nativeElement;
		this.editor = ace.edit(el);
		this.init();
		this.initEvents();
	}

	init() {
		this.editor.getSession().setUseWorker(false);
		this.editor.setOptions(this._options);
		this.editor.setTheme(`ace/theme/${this._theme}`);
		this.editor.getSession().setMode(`ace/mode/${this._mode}`);
		this.editor.setHighlightActiveLine(this._highlightActiveLine);
		this.editor.renderer.setShowGutter(this._showGutter);
		this.editor.setReadOnly(this._readOnly);
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

	@Input() set options(options: Record<string, unknown>) {
		this._options = options;
		this.editor.setOptions(options || {});
	}

	@Input() set readOnly(readOnly: boolean) {
		this._readOnly = readOnly;
		this.editor.setReadOnly(readOnly);
	}

	@Input() set theme(theme: string) {
		this._theme = theme;
		this.editor.setTheme(`ace/theme/${theme}`);
	}

	@Input() set mode(mode: string) {
		this._mode = mode;
		this.editor.getSession().setMode(`ace/mode/${mode}`);
	}

	private _initialApplied = false;

	@Input() set text(text: string) {
		// One-shot initial content; later syncs go through setText() imperatively
		if (this._initialApplied) {
			return;
		}
		this._initialApplied = true;
		if (!text) {
			text = "";
		}
		this.setText(text);
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

	@Input() set autoUpdateContent(status: boolean) {
		this._autoUpdateContent = status;
	}
}
