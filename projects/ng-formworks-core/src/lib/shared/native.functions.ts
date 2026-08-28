let uniqueIdCounter = 0;

export function isPlainObject(value: any): boolean {
	if (value === null || typeof value !== "object") {
		return false;
	}
	const proto = Object.getPrototypeOf(value);
	return proto === null || proto === Object.prototype;
}

export function cloneDeep<T>(value: T): T {
	if (value === null || typeof value !== "object") {
		return value;
	}
	if (value instanceof Date) {
		return new Date(value.getTime()) as any;
	}
	if (Array.isArray(value)) {
		return value.map((item) => cloneDeep(item)) as any;
	}
	if (!isPlainObject(value)) {
		return value;
	}
	const clone: any = {};
	for (const key of Object.keys(value)) {
		clone[key] = cloneDeep(value[key as keyof T]);
	}
	return clone;
}

export function deepEqual(a: any, b: any): boolean {
	if (a === b) {
		return true;
	}
	if (typeof a === "number" && typeof b === "number") {
		return isNaN(a) && isNaN(b);
	}
	if (a === null || b === null || typeof a !== "object" || typeof b !== "object") {
		return false;
	}
	if (a instanceof Date && b instanceof Date) {
		return a.getTime() === b.getTime();
	}
	if (Array.isArray(a) !== Array.isArray(b)) {
		return false;
	}
	const keysA = Object.keys(a);
	const keysB = Object.keys(b);
	if (keysA.length !== keysB.length) {
		return false;
	}
	return keysA.every(
		(key) => Object.prototype.hasOwnProperty.call(b, key) && deepEqual(a[key], b[key]),
	);
}

export function uniqueId(prefix = ""): string {
	uniqueIdCounter += 1;
	return `${prefix}${uniqueIdCounter}`;
}

export function memoize<T extends (...args: any[]) => any>(
	fn: T,
	resolver?: (...args: any[]) => any,
): ((...args: Parameters<T>) => ReturnType<T>) & { cache: Map<any, ReturnType<T>> } {
	const cache = new Map<any, ReturnType<T>>();
	const memoized = (...args: Parameters<T>): ReturnType<T> => {
		const key = resolver ? resolver(...args) : args[0];
		if (cache.has(key)) {
			return cache.get(key)!;
		}
		const result = fn(...args);
		cache.set(key, result);
		return result;
	};
	memoized.cache = cache;
	return memoized;
}

export function omit<T extends Record<string, any>>(
	object: T,
	keysToOmit: Array<string | number | symbol>,
): T {
	if (!object || typeof object !== "object") {
		return object;
	}
	const result: any = { ...object };
	for (const key of keysToOmit) {
		delete result[key];
	}
	return result;
}

export function pick<T extends Record<string, any>>(
	object: T,
	keysToPick: Array<string | number | symbol>,
): T {
	if (!object || typeof object !== "object") {
		return object;
	}
	const result: any = {};
	for (const key of Object.keys(object)) {
		if (keysToPick.includes(key)) {
			result[key] = object[key];
		}
	}
	return result;
}
