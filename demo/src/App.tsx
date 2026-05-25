import { useState } from 'react';
import AccentFolding, { type AccentMap } from 'accent-folding';

// Custom map typed with AccentMap — triggers a TS error if keys/values aren't strings
const germanMap: AccentMap = { ö: 'oe', ü: 'ue', ä: 'ae', ß: 'ss' };

const af = new AccentFolding();
const afGerman = new AccentFolding(germanMap);

const NAMES = [
	'López',
	'Müller',
	'Björk',
	'Ñoño',
	'García',
	'Renée',
	'Ångström',
	'Čehov',
	'Dubček',
];

type WrapTag = 'b' | 'strong' | 'mark' | 'span';

function matches(name: string, query: string): boolean {
	return af
		.replace(name)
		.toLowerCase()
		.includes(af.replace(query).toLowerCase());
}

export default function App() {
	const [query, setQuery] = useState<string>('');
	const [tag, setTag] = useState<WrapTag>('b');

	const rows: string[] = query ? NAMES.filter((n) => matches(n, query)) : NAMES;

	return (
		<div className="page">
			<header>
				<h1>accent-folding · TypeScript demo</h1>
				<p className="subtitle">
					Real TypeScript consumer — imports <code>AccentFolding</code> and{' '}
					<code>AccentMap</code> from the local package. Try <strong>lo</strong>
					, <strong>mu</strong>, <strong>gar</strong>, or <strong>bj</strong>.
				</p>
			</header>

			<section className="card">
				<h2>Search demo</h2>
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search names…"
					autoComplete="off"
				/>
				<div className="controls">
					<label htmlFor="wrap-tag">Wrap tag:</label>
					<select
						id="wrap-tag"
						value={tag}
						onChange={(e) => setTag(e.target.value as WrapTag)}
					>
						<option value="b">b (default)</option>
						<option value="strong">strong</option>
						<option value="mark">mark</option>
						<option value="span">span</option>
					</select>
				</div>
				<table>
					<thead>
						<tr>
							<th>Original</th>
							<th>replace(name)</th>
							<th>highlightMatch(name, query)</th>
						</tr>
					</thead>
					<tbody>
						{rows.length === 0 ? (
							<tr>
								<td colSpan={3} className="empty">
									No matches
								</td>
							</tr>
						) : (
							rows.map((name) => (
								<tr key={name}>
									<td>{name}</td>
									<td>{af.replace(name)}</td>
									<td
										dangerouslySetInnerHTML={{
											__html: query
												? af.highlightMatch(name, query, tag)
												: name,
										}}
									/>
								</tr>
							))
						)}
					</tbody>
				</table>
			</section>

			<section className="card">
				<h2>Custom AccentMap (German)</h2>
				<p className="subtitle">
					<code>AccentMap</code> typed as{' '}
					<code>{'Record<string, string>'}</code> — afGerman uses{' '}
					<code>ö→oe, ü→ue, ä→ae, ß→ss</code>
				</p>
				<table>
					<thead>
						<tr>
							<th>Original</th>
							<th>default replace()</th>
							<th>german replace()</th>
						</tr>
					</thead>
					<tbody>
						{['Müller', 'Björk', 'Füße', 'Bäcker'].map((name) => (
							<tr key={name}>
								<td>{name}</td>
								<td>{af.replace(name)}</td>
								<td>{afGerman.replace(name)}</td>
							</tr>
						))}
					</tbody>
				</table>
			</section>

			<section className="card types-card">
				<h2>TypeScript types at work</h2>
				<pre>{`import AccentFolding, { type AccentMap } from 'accent-folding';

const af = new AccentFolding();

const replaced:    string = af.replace('café');
const highlighted: string = af.highlightMatch('López', 'lo');
const withTag:     string = af.highlightMatch('López', 'lo', 'mark');

const myMap: AccentMap = { ö: 'oe', ü: 'ue' };
const afCustom = new AccentFolding(myMap);

// These would be TS errors:
// af.replace(42)              → Argument of type 'number' is not assignable to 'string'
// af.highlightMatch('x', 42) → Argument of type 'number' is not assignable to 'string'`}</pre>
			</section>
		</div>
	);
}
