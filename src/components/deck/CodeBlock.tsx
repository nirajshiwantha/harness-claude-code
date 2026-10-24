import React from 'react';

type CodeBlockProps = {
  code: string;
  filename?: string;
  size?: 'md' | 'sm';
};

export function CodeBlock({ code, filename, size = 'md' }: CodeBlockProps) {
  const lines = code.split('\n');
  const textSize = size === 'sm' ? 'text-[0.95vw]' : 'text-[1.15vw]';

  return (
    <div className="overflow-hidden rounded-[1vw] border border-line bg-panel">
      <div className="flex items-center gap-[0.6vw] border-b border-line px-[1.4vw] py-[1.2vh]">
        <span className="h-[0.55vw] w-[0.55vw] rounded-full bg-coral" aria-hidden="true" />
        <span className="font-mono text-[0.95vw] text-dim">{filename ?? 'terminal'}</span>
      </div>
      <pre className={`overflow-hidden px-[1.6vw] py-[2vh] font-mono leading-[1.6] ${textSize}`}>
        {lines.map((line, i) =>
        <div key={i} className="whitespace-pre">
            {renderLine(line)}
            {line === '' ? ' ' : null}
          </div>
        )}
      </pre>
    </div>);

}

function renderLine(line: string) {
  if (/^-{3}$/.test(line.trim())) {
    return <span className="text-dim/60">{line}</span>;
  }
  if (line.startsWith('$')) {
    return (
      <>
        <span className="text-coral">$</span>
        <span className="text-fg">{line.slice(1)}</span>
      </>);

  }
  const match = line.match(/^(\s*)("?[A-Za-z_][\w-]*"?)(:)(.*)$/);
  if (match) {
    return (
      <>
        {match[1]}
        <span className="text-coral-soft">{match[2]}</span>
        <span className="text-dim">{match[3]}</span>
        <span className="text-fg">{match[4]}</span>
      </>);

  }
  return <span className="text-fg-soft">{line}</span>;
}