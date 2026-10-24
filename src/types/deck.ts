export type KeyValueRow = {
  key: string;
  value: string;
};

export type KeyValueContent = {
  eyebrow?: string;
  title: string;
  rows: KeyValueRow[];
  layout?: 'rows' | 'grid';
  monoKeys?: boolean;
  note?: string;
  leadCode?: string;
  code?: string;
  codeCaption?: string;
};

export type Column = {
  eyebrow?: string;
  title?: string;
  command?: string;
  code?: string;
  body?: string;
  bullets?: string[];
};

export type ColumnsContent = {
  eyebrow?: string;
  title: string;
  intro?: string;
  columns: Column[];
  note?: string;
};

export type CodeContent = {
  eyebrow?: string;
  title: string;
  bullets: string[];
  filename?: string;
  code: string;
};

export type AgendaItem = {
  number: string;
  topic: string;
  focus: string;
};

export type StoryStep = {
  kind: string;
  name: string;
  description: string;
};