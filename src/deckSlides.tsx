import React, { type ComponentType } from 'react';

import { AgendaSlide } from './components/deck/AgendaSlide';
import { CodeSlide } from './components/deck/CodeSlide';
import { ColumnsSlide } from './components/deck/ColumnsSlide';
import { CoverSlide } from './components/deck/CoverSlide';
import { KeyValueSlide } from './components/deck/KeyValueSlide';
import { StatementSlide } from './components/deck/StatementSlide';
import { StorySlide } from './components/deck/StorySlide';
import {
  agendaItems,
  betterSetup,
  customCommands,
  hooksPractice,
  mcpPlugins,
  planMode,
  skills,
  slashCommands,
  storySteps,
  subagents } from
'./data/deckContent';

export type DeckSlide = {
  // Stable id — keep it matching this slide's screen id in canvas.manifest.js.
  id: string;
  // On-slide title — should match the Screen name in canvas.manifest.js.
  title: string;
  component: ComponentType;
};

export const slides: DeckSlide[] = [
{ id: 'scr_7pnir0', title: 'Harnessing Claude Code', component: CoverSlide },
{ id: 'scr_ag3nda', title: 'Agenda', component: () => <AgendaSlide items={agendaItems} /> },
{ id: 'scr_setup1', title: betterSetup.title, component: () => <ColumnsSlide {...betterSetup} /> },
{ id: 'scr_plan01', title: planMode.title, component: () => <KeyValueSlide {...planMode} /> },
{ id: 'scr_slash1', title: slashCommands.title, component: () => <ColumnsSlide {...slashCommands} /> },
{ id: 'scr_cmds01', title: customCommands.title, component: () => <CodeSlide {...customCommands} /> },
{ id: 'scr_skill1', title: skills.title, component: () => <CodeSlide {...skills} /> },
{ id: 'scr_subag1', title: subagents.title, component: () => <CodeSlide {...subagents} /> },
{
  id: 'scr_hooks1',
  title: 'Hooks run every time, whatever the model decides.',
  component: () =>
  <StatementSlide
    statement="Hooks run every time, whatever the model decides."
    support="Claude doesn't even know they exist. That's the point." />


},
{ id: 'scr_hooks2', title: hooksPractice.title, component: () => <ColumnsSlide {...hooksPractice} /> },
{ id: 'scr_mcp001', title: mcpPlugins.title, component: () => <ColumnsSlide {...mcpPlugins} /> },
{
  id: 'scr_story1',
  title: 'One repo, one story',
  component: () => <StorySlide steps={storySteps} />
}];