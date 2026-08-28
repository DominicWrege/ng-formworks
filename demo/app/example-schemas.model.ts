export interface PlaygroundExample {
	name: string;
	file: string;
}

/**
 * Curated mixed-control examples for eyeballing the Tailwind widget styling.
 * Each example deliberately mixes many control types and framework features.
 */
export const PLAYGROUND_EXAMPLES: PlaygroundExample[] = [
	{
		name: "Controls — inputs, selects, checks & radios",
		file: "playground-controls",
	},
	{
		name: "Layout — flex, tabs, sections & conditionals",
		file: "playground-layout",
	},
	{
		name: "Arrays — simple, object lists & nested",
		file: "playground-arrays",
	},
	{
		name: "User profile — schema only, names & descriptions, no layout",
		file: "showcase-user-profile",
	},
	{
		name: "Product order — enums & numbers, no layout",
		file: "showcase-product-order",
	},
	{
		name: "Event registration — multi-select arrays, no layout",
		file: "showcase-event-registration",
	},
	{ name: "Recipe — nested objects, no layout", file: "showcase-recipe" },
	{
		name: "App settings — grouped sections, no layout",
		file: "showcase-app-settings",
	},
	{
		name: "Team roster — array of objects (4 attrs each), no layout",
		file: "showcase-team-roster",
	},
	{
		name: "Invoice — array of line items (4 attrs each), no layout",
		file: "showcase-invoice-lineitems",
	},
];
