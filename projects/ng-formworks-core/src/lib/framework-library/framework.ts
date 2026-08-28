import { Injectable, Type } from "@angular/core";
import type { WidgetLibraryMap } from "../shared/types";

@Injectable()
export class Framework {
	name!: string;
	text!: string;
	framework!: Type<unknown>;
	widgets?: WidgetLibraryMap = {};
	stylesheets?: string[] = [];
	scripts?: string[] = [];
}
