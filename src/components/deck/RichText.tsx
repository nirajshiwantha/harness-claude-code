import React from 'react';

type RichTextProps = {
  text: string;
};

/** Renders `code` and **bold** inline markers inside slide copy. */
export function RichText({ text }: RichTextProps) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={i}
              className="rounded-[0.25em] bg-fg/[0.06] px-[0.3em] py-[0.05em] font-mono text-[0.88em] text-coral-soft">
              
              {part.slice(1, -1)}
            </code>);

        }
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-semibold text-fg">
              {part.slice(2, -2)}
            </strong>);

        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>);

}