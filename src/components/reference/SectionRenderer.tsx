import type { ReferenceSection } from '../../data/reference';
import diagramRegistry from './DiagramRegistry';
import DiagramZoom from '../DiagramZoom';
import MatchingActivity from '../interactive/MatchingActivity';
import TrueFalse from '../interactive/TrueFalse';
import DidYouKnow from '../interactive/DidYouKnow';
import FrequencySlider from '../interactive/FrequencySlider';
import TonePlayer from '../interactive/TonePlayer';
import IntervalPlayer from '../interactive/IntervalPlayer';
import BeatMachine from '../interactive/BeatMachine';
import HarmonicsExplorer from '../interactive/HarmonicsExplorer';

/**
 * Render inline markdown: **bold** and `code`.
 * Returns an array of React nodes.
 */
function renderInlineMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Match **bold** and `code` spans
  const regex = /(\*\*(.+?)\*\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    // Text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      // **bold**
      parts.push(
        <strong key={key++} className="font-semibold text-gray-900 dark:text-white">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      // `code`
      parts.push(
        <code
          key={key++}
          className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-sm font-mono text-rose-600 dark:text-rose-400"
        >
          {match[3]}
        </code>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  // Remaining text after last match
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function isMarkdownTable(text: string): boolean {
  const lines = text.trim().split('\n');
  return lines.length >= 3 && lines[0].includes('|') && lines[1].includes('---');
}

function renderTable(text: string, key: number) {
  const lines = text.trim().split('\n').filter(l => l.trim());
  const parseRow = (line: string) =>
    line.split('|').map(c => c.trim()).filter(c => c.length > 0);

  const headers = parseRow(lines[0]);
  const rows = lines.slice(2).map(parseRow); // skip header + separator

  return (
    <div key={key} className="overflow-x-auto mb-3">
      <table className="w-full text-sm border-collapse rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                {renderInlineMarkdown(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-2 text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700">
                  {renderInlineMarkdown(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderContent(content: string) {
  const paragraphs = content.split('\n\n');
  return paragraphs.map((p, i) => {
    if (isMarkdownTable(p)) {
      return renderTable(p, i);
    }
    // Bullet lists
    if (p.trim().startsWith('• ') || p.trim().startsWith('- ')) {
      const items = p.trim().split('\n').filter(l => l.trim());
      return (
        <ul key={i} className="text-sm text-gray-700 dark:text-gray-300 mb-3 space-y-1 ml-1">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5 flex-shrink-0">•</span>
              <span>{renderInlineMarkdown(item.replace(/^[•\-]\s*/, ''))}</span>
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p key={i} className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 mb-3 last:mb-0">
        {renderInlineMarkdown(p)}
      </p>
    );
  });
}

function renderInteractive(config: NonNullable<ReferenceSection['interactive']>) {
  switch (config.type) {
    case 'matching':
      return (
        <MatchingActivity
          pairs={config.props.pairs as [string, string][]}
          title={config.props.title as string}
        />
      );
    case 'true-false': {
      // Support both single statement and array of statements
      const statements = config.props.statements as { text: string; answer: boolean; explanation: string }[] | undefined;
      if (statements) {
        return (
          <div className="space-y-2">
            {statements.map((s, i) => (
              <TrueFalse key={i} statement={s.text} isTrue={s.answer} explanation={s.explanation} />
            ))}
          </div>
        );
      }
      return (
        <TrueFalse
          statement={config.props.statement as string}
          isTrue={config.props.isTrue as boolean}
          explanation={config.props.explanation as string}
        />
      );
    }
    case 'did-you-know':
      return <DidYouKnow facts={config.props.facts as string[]} />;
    case 'slider':
      return <FrequencySlider />;
    case 'tone-player':
      return <TonePlayer />;
    case 'interval-player':
      return <IntervalPlayer />;
    case 'beat-machine':
      return <BeatMachine />;
    case 'harmonics-explorer':
      return <HarmonicsExplorer />;
    default:
      return null;
  }
}

interface Props {
  section: ReferenceSection;
}

export default function SectionRenderer({ section }: Props) {
  const DiagramComponent = section.diagram ? diagramRegistry[section.diagram] : null;

  if (section.diagram) {
    console.log(`[SectionRenderer] title="${section.title}" diagram="${section.diagram}" found=${!!DiagramComponent} registryKeys=${Object.keys(diagramRegistry).join(',')}`);
  }

  return (
    <div className="mb-6 last:mb-0">
      <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">
        {section.title}
      </h4>

      {/* Content text */}
      {section.content && renderContent(section.content)}

      {/* Code block */}
      {section.code && (
        <div className="mt-3 rounded-xl bg-gray-900 p-4 overflow-x-auto">
          <pre className="text-sm font-mono text-gray-100 leading-relaxed whitespace-pre">
            {section.code}
          </pre>
        </div>
      )}

      {/* Diagram */}
      {DiagramComponent && (
        <div className="mt-3">
          <DiagramZoom>
            <DiagramComponent />
          </DiagramZoom>
        </div>
      )}

      {/* Interactive widget */}
      {section.interactive && (
        <div className="mt-3">
          {renderInteractive(section.interactive)}
        </div>
      )}
    </div>
  );
}
