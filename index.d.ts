export type AccentMap = Record<string, string>;

export interface MatchPosition {
	start: number;
	end: number;
}

export default class AccentFolding {
	constructor(newMap?: AccentMap | null);
	replace(text: string): string;
	matchPositions(str: string, fragment: string): MatchPosition[];
	highlightMatch(str: string, fragment: string, wrapTag?: string): string;
	static convertAccentMapToArray(accentMap: AccentMap): Array<[string, string]>;
}
