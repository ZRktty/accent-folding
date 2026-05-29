import { useState } from 'react';
import npmIcon from '../npm-icon.svg';
import AccentFolding, {
	type AccentMap,
	type MatchPosition,
} from 'accent-folding';

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

function Highlight({ text, query }: { text: string; query: string }) {
	const positions: MatchPosition[] = query
		? af.matchPositions(text, query)
		: [];
	if (!positions.length) return <span>{text}</span>;

	const parts: React.ReactNode[] = [];
	let last = 0;
	for (const { start, end } of positions) {
		if (start > last) parts.push(text.slice(last, start));
		parts.push(
			<mark
				key={start}
				className="bg-yellow-200 text-yellow-900 rounded px-0.5 font-semibold not-italic"
			>
				{text.slice(start, end)}
			</mark>
		);
		last = end;
	}
	parts.push(text.slice(last));
	return <span>{parts}</span>;
}

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
				<div className="flex flex-wrap items-center gap-3 mb-1">
					<h1 style={{ margin: 0 }}>accent-folding</h1>
					<div className="flex items-center gap-2">
						<a
							href="https://www.npmjs.com/package/accent-folding"
							target="_blank"
							rel="noopener noreferrer"
							title="View on npm"
							className="opacity-70 hover:opacity-100 transition-opacity"
						>
							<img src={npmIcon} alt="npm" width={20} height={20} />
						</a>
						<a
							href="https://github.com/ZRktty/accent-folding"
							target="_blank"
							rel="noopener noreferrer"
							title="View on GitHub"
							className="opacity-70 hover:opacity-100 transition-opacity text-gray-700"
						>
							<svg
								viewBox="0 0 16 16"
								width="20"
								height="20"
								aria-label="GitHub"
								role="img"
								fill="currentColor"
							>
								<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
							</svg>
						</a>
					</div>
				</div>
				<p className="subtitle">
					Accent-insensitive search and highlight. Try <strong>lo</strong>,{' '}
					<strong>mu</strong>, <strong>gar</strong>, or <strong>bj</strong>.
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
					<code>{'Record<string, string>'}</code> — <code>afGerman</code> uses{' '}
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

			<section className="card">
				<h2>matchPositions() — real React elements, Tailwind styling</h2>
				<p className="subtitle">
					Same accent-insensitive search, but instead of injecting raw HTML you
					get <code>[&#123; start, end &#125;]</code> pairs and own the render
					entirely. No <code>dangerouslySetInnerHTML</code>.
				</p>

				{/* Live search */}
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search names…"
					autoComplete="off"
				/>
				<ul className="mt-2 space-y-1">
					{(query ? NAMES.filter((n) => matches(n, query)) : NAMES).map(
						(name) => (
							<li
								key={name}
								className="px-3 py-2 rounded-lg border border-gray-100 bg-gray-50 text-sm font-mono"
							>
								<Highlight text={name} query={query} />
							</li>
						)
					)}
				</ul>

				{/* Before / After comparison */}
				<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
					{/* Before */}
					<div className="rounded-xl border border-red-200 bg-red-50 p-4">
						<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-red-500">
							Before — highlightMatch()
						</p>
						<pre className="overflow-x-auto rounded bg-white p-3 text-xs leading-relaxed text-gray-700 border border-red-100">{`<li dangerouslySetInnerHTML={{
  __html: af.highlightMatch(name, query)
}} />`}</pre>
						<ul className="mt-3 space-y-1 text-xs text-red-700">
							<li>
								✗ ESLint flags{' '}
								<code className="font-mono">dangerouslySetInnerHTML</code>
							</li>
							<li>✗ Senior devs reject it in code review</li>
							<li>
								✗ Can't attach event handlers to the{' '}
								<code className="font-mono">&lt;b&gt;</code>
							</li>
							<li>✗ Useless in React Native — no DOM</li>
							<li>✗ Useless in PDF libs, canvas, terminal</li>
						</ul>
					</div>

					{/* After */}
					<div className="rounded-xl border border-green-200 bg-green-50 p-4">
						<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-green-600">
							After — matchPositions()
						</p>
						<pre className="overflow-x-auto rounded bg-white p-3 text-xs leading-relaxed text-gray-700 border border-green-100">{`const pos = af.matchPositions(text, query);
// render <mark> with any Tailwind class you want
<mark className="bg-yellow-200 text-yellow-900
  rounded px-0.5 font-semibold">
  {text.slice(start, end)}
</mark>`}</pre>
						<ul className="mt-3 space-y-1 text-xs text-green-700">
							<li>✓ Real React elements, zero ESLint warnings</li>
							<li>✓ Full Tailwind / CSS-in-JS / Framer Motion control</li>
							<li>
								✓ Works in React Native{' '}
								<code className="font-mono">&lt;Text&gt;</code>
							</li>
							<li>✓ Works in PDF libs, canvas pixel offsets, ANSI terminal</li>
							<li>✓ Stable React keys, compatible with concurrent mode</li>
						</ul>
					</div>
				</div>

				{/* Code snippet */}
				<div className="mt-5">
					<p className="mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
						The Highlight component used above
					</p>
					<pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-xs leading-relaxed text-gray-100">{`function Highlight({ text, query }) {
  const positions = af.matchPositions(text, query);
  if (!positions.length) return <span>{text}</span>;

  const parts = [];
  let last = 0;
  for (const { start, end } of positions) {
    if (start > last) parts.push(text.slice(last, start));
    parts.push(
      <mark
        key={start}
        className="bg-yellow-200 text-yellow-900 rounded px-0.5 font-semibold"
      >
        {text.slice(start, end)}
      </mark>
    );
    last = end;
  }
  parts.push(text.slice(last));
  return <span>{parts}</span>;
}`}</pre>
				</div>
			</section>

			<section className="card types-card">
				<h2>TypeScript types at work</h2>
				<pre>{`import AccentFolding, { type AccentMap, type MatchPosition } from 'accent-folding';

const af = new AccentFolding();

const replaced:    string          = af.replace('café');
const positions:   MatchPosition[] = af.matchPositions('López', 'lo');
const highlighted: string          = af.highlightMatch('López', 'lo');
const withTag:     string          = af.highlightMatch('López', 'lo', 'mark');

const myMap: AccentMap = { ö: 'oe', ü: 'ue' };
const afCustom = new AccentFolding(myMap);

// Type your own rendering helper:
function renderParts(text: string, pos: MatchPosition[]) { ... }

// These would be TS errors:
// af.replace(42)              → Argument of type 'number' is not assignable to 'string'
// af.highlightMatch('x', 42) → Argument of type 'number' is not assignable to 'string'`}</pre>
			</section>
		</div>
	);
}
