import type {
  AgendaItem,
  CodeContent,
  ColumnsContent,
  KeyValueContent,
  StoryStep } from
'../types/deck';

export const agendaItems: AgendaItem[] = [
{ number: '1', topic: 'Setup and commands', focus: 'Better /init, plan mode, slash and custom commands' },
{ number: '2', topic: 'Skills', focus: 'Reusable playbooks' },
{ number: '3', topic: 'Subagents', focus: 'Specialists with their own context' },
{ number: '4', topic: 'Hooks', focus: 'Rules that always run' },
{ number: '5', topic: 'Scaling up', focus: 'MCP and plugins' },
{ number: '6', topic: 'Wrap-up', focus: 'One story that ties it together' }];


export const betterSetup: ColumnsContent = {
  title: 'Start with a better setup',
  columns: [
  {
    title: 'Better /init',
    command: '`CLAUDE_CODE_NEW_INIT=1 claude`',
    body: '/init asks how you work (Git, deploys, skills, hooks), shows a plan, then writes a lean CLAUDE.md plus starter skills and hooks.'
  },
  {
    title: 'Import a setup',
    command: '`/import codex` · `/import cursor`',
    body: 'Lists the instruction files and MCP servers from your old agent. Pick what to bring; Claude copies it over.'
  },
  {
    title: 'Learn in place',
    command: '`/powerup`',
    body: 'Short lessons inside Claude Code, each with an animated demo of one feature.'
  }],

  note: "**Rule of thumb:** CLAUDE.md holds only what Claude can't learn by reading the code."
};

export const planMode: KeyValueContent = {
  title: 'Better plan mode',
  monoKeys: true,
  rows: [
  {
    key: '/model opusplan',
    value: 'Opus plans, Sonnet builds: stronger plans, less of your usage limit'
  },
  {
    key: '/advisor',
    value: 'Adds a stronger reviewer model that Claude consults before big decisions and before it finishes'
  }]
};

export const slashCommands: ColumnsContent = {
  title: 'Slash commands you’ll use daily',
  columns: [
  {
    title: 'Context',
    bullets: [
    '`/clear` — fresh context for a new task',
    '`/compact` — summarise and keep going',
    '`/context` — see what fills the window',
    '`/rewind` — roll back code and chat to a checkpoint']

  },
  {
    title: 'Session',
    bullets: [
    '`/resume` — pick up a past session',
    '`/model` — switch model mid-session',
    '`/cost` — tokens and spend so far',
    '`/status` — version, model and account']

  },
  {
    title: 'Setup',
    bullets: [
    '`/memory` — edit your CLAUDE.md files',
    '`/permissions` — allow and deny rules',
    '`/agents` · `/hooks` · `/mcp` — manage each layer',
    '`/doctor` — check your install']

  }],

  note: 'Type **/** in the prompt box to see every command, including your own and your plugins’.'
};

export const customCommands: CodeContent = {
  title: 'Custom commands: write your own',
  bullets: [
  'A markdown file in `.claude/commands/` becomes **/name**',
  '`$ARGUMENTS` is whatever you type after the command',
  'Frontmatter sets `description`, `allowed-tools` and `model`',
  '**Run it:** `/fix-item 4821` — then commit it for the team'],

  filename: '.claude/commands/fix-item.md',
  code: `---
description: Fix a work item end to end
allowed-tools: Read, Edit, Bash(dotnet:*)
---
Fix Azure DevOps item #$ARGUMENTS.
1. Read the item and find the code
2. Write a failing test, then fix it
3. Run dotnet test
4. Commit with "Fixes #$ARGUMENTS"`
};

export const skills: CodeContent = {
  title: 'Skills',
  bullets: [
  'A folder with a **SKILL.md**, run as **/name** by you or picked up by Claude',
  'Project: `.claude/skills/<name>/` · Personal: `~/.claude/skills/<name>/`',
  'Loaded only when needed, so keep CLAUDE.md short and push detail here'],

  filename: '.claude/skills/add-endpoint/SKILL.md',
  code: `---
name: add-endpoint
description: Add an API endpoint the way our team builds them
---
1. Dapper repository method + SQL
2. Controller action with validation
3. xUnit test for the happy path
4. Run dotnet build and dotnet test`
};

export const subagents: CodeContent = {
  title: 'Subagents',
  bullets: [
  '**Own context window:** it reads 40 files, your session gets back only the summary',
  '**Own instructions and tools,** and it can preload skills',
  '**Run several in parallel:** explore, review, test'],

  filename: '.claude/agents/code-reviewer.md',
  code: `---
name: code-reviewer
description: Reviews changes for bugs, security and our conventions
tools: Read, Grep, Glob
---
You are a senior .NET reviewer.
Report findings by severity.
Do not edit files.`
};

export const hooksPractice: ColumnsContent = {
  title: 'Hooks',
  intro: 'Hooks run every time, whatever the model decides.',
  columns: [
  {
    eyebrow: 'PostToolUse · after every edit',
    title: 'Format code automatically',
    code: `"PostToolUse": [{
  "matcher": "Edit|Write",
  "hooks": [{
    "type": "command",
    "command": "dotnet format"
  }]
}]`
  },
  {
    eyebrow: 'PreToolUse · before an edit',
    title: 'Block prod config changes',
    body: 'A script checks the target path and exits with code 2 for `appsettings.Production.json`. The edit is blocked and Claude sees why.'
  }],

  note: 'Lives in **.claude/settings.json**. Commit it so the whole team gets the same rules.'
};

export const mcpPlugins: ColumnsContent = {
  title: 'MCP and plugins',
  columns: [
  {
    eyebrow: 'MCP',
    title: 'Connects Claude to your systems',
    bullets: [
    'Azure DevOps work items and pipelines',
    'Databases for schema-aware queries',
    'Internal docs and APIs',
    'Add with `claude mcp add`, or share a `.mcp.json` in the repo']

  },
  {
    eyebrow: 'Plugins',
    title: 'Packages it all for the team',
    bullets: [
    'One installable unit: skills, subagents, hooks, MCP servers',
    'Namespaced commands, e.g. `/team-dotnet:review`',
    'Install from a marketplace, so everyone gets the same setup']

  }]

};

export const storySteps: StoryStep[] = [
{ kind: 'Skill', name: '/add-endpoint', description: 'Builds the feature' },
{ kind: 'Subagent', name: 'code-reviewer', description: 'Checks it' },
{ kind: 'Hook', name: 'dotnet format', description: 'Cleans every edit' },
{ kind: 'Plugin', name: 'team setup', description: 'Ships the whole setup to the team' }];