import { Suspense, Component, useState, useEffect, type ReactNode } from 'react';
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
import GaussianExplorer from '../interactive/GaussianExplorer';
import ContourExplainer from '../interactive/ContourExplainer';
import LogicGateSimulator from '../interactive/LogicGateSimulator';
import SqlPlayground from '../SqlPlayground';
import TsPlayground from '../TsPlayground';
import HtmlPlayground from '../HtmlPlayground';
import PythonPlayground from '../PythonPlayground';
import PracticeProblems from '../interactive/PracticeProblems';
import { useAuth } from '../../contexts/AuthContext';
import SignUpGate from '../SignUpGate';

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
    case 'gaussian-explorer':
      return <GaussianExplorer />;
    case 'contour-explainer':
      return <ContourExplainer />;
    case 'logic-gate-simulator':
      return <LogicGateSimulator />;
    case 'sql-playground':
      return <SqlPlayground starterCode={config.props.starterCode as string} title={config.props.title as string | undefined} />;
    case 'ts-playground':
      return <TsPlayground starterCode={config.props.starterCode as string} title={config.props.title as string | undefined} />;
    case 'html-playground':
      return <HtmlPlayground starterCode={config.props.starterCode as string} title={config.props.title as string | undefined} />;
    case 'python-playground':
      return <PythonPlayground starterCode={config.props.starterCode as string} title={config.props.title as string | undefined} />;
    default:
      return null;
  }
}

interface Props {
  section: ReferenceSection;
  level?: 0 | 1 | 2;
}

const GATED_INTERACTIVE_TYPES = new Set([
  'slider', 'tone-player', 'interval-player', 'beat-machine',
  'harmonics-explorer', 'gaussian-explorer', 'contour-explainer', 'logic-gate-simulator', 'sql-playground', 'ts-playground', 'html-playground',
]);

function ClientOnly({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-48 rounded-xl bg-gray-100 dark:bg-gray-700/30 animate-pulse mt-3" />;
  return <>{children}</>;
}

class DiagramErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() { return this.state.hasError ? null : this.props.children; }
}

export default function SectionRenderer({ section, level = 0 }: Props) {
  const { user } = useAuth();
  const isSignedIn = !!user;
  const DiagramComponent = section.diagram ? diagramRegistry[section.diagram] : null;

  return (
    <div className="mb-6 last:mb-0">
      <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">
        {section.title}
      </h4>

      {/* Beginner — everyone sees this */}
      {section.beginnerContent && renderContent(section.beginnerContent)}

      {/* Intermediate — formulas, calculations */}
      {level >= 1 && section.intermediateContent && (
        <div className="mt-3 pl-3 border-l-2 border-blue-300 dark:border-blue-700">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">🔬 Going deeper</span>
          </div>
          {renderContent(section.intermediateContent)}
        </div>
      )}

      {/* Advanced — derivations, research */}
      {level >= 2 && section.advancedContent && (
        <div className="mt-3 pl-3 border-l-2 border-purple-300 dark:border-purple-700">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">🚀 Advanced</span>
          </div>
          {renderContent(section.advancedContent)}
        </div>
      )}

      {/* Code block */}
      {section.code && (
        <div className="mt-3 rounded-xl bg-gray-900 p-4 overflow-x-auto">
          <pre className="text-sm font-mono text-gray-100 leading-relaxed whitespace-pre">
            {section.code}
          </pre>
        </div>
      )}

      {/* Diagram — client-only to avoid hydration mismatch with lazy imports */}
      {DiagramComponent && (
        <ClientOnly>
          <DiagramErrorBoundary>
            <Suspense fallback={<div className="h-48 rounded-xl bg-gray-100 dark:bg-gray-700/30 animate-pulse mt-3" />}>
              <div className="mt-3">
                <DiagramZoom>
                  <DiagramComponent />
                </DiagramZoom>
              </div>
            </Suspense>
          </DiagramErrorBoundary>
        </ClientOnly>
      )}

      {/* Interactive widget — gate rich tools for non-signed-in users */}
      {section.interactive && (
        <div className="mt-3">
          {!isSignedIn && GATED_INTERACTIVE_TYPES.has(section.interactive.type) ? (
            <SignUpGate message="Sign up free to use interactive tools" compact />
          ) : (
            renderInteractive(section.interactive)
          )}
        </div>
      )}

      {/* Practice problems — button-accessed, not inline */}
      {section.practice && (
        <div className="mt-3">
          {!isSignedIn ? (
            <SignUpGate message="Sign up free to practice problems" compact />
          ) : (
            <ClientOnly>
              <PracticeProblems practice={section.practice} />
            </ClientOnly>
          )}
        </div>
      )}
    </div>
  );
}
