# Speaking Notes

## Slide 1: Cover

Quick question: who here has used Claude Code? For anyone new, here is what it is. Claude Code is an AI coding assistant that lives in your terminal and your editor. It is not just a chat window. It can read your project, edit files, run commands and tests, and commit your changes, while you stay in control and approve what it does. Think of it as a new teammate who is very fast but knows nothing about your project on day one. Today is about onboarding that teammate: telling it how you work, giving it playbooks, setting rules it can't skip, and sharing that setup with the whole team.

## Slide 2: Agenda

We go in six steps: setup and commands, skills, subagents, hooks, scaling up, then a wrap-up. By the end it all joins into one story: a skill builds the feature, a subagent reviews it, a hook cleans it up, and a plugin ships it to the team.

If you haven't installed Claude Code yet, it takes one minute. On Windows, open PowerShell and run:

```powershell
irm https://claude.ai/install.ps1 | iex
```

On Mac or Linux:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

If you prefer npm, this works too (you need Node.js installed):

```bash
npm install -g @anthropic-ai/claude-code
```

Then go to your project folder, type `claude`, and sign in the first time. That's it.

You can also use it inside VS Code. Install the extension called "Claude Code" from Anthropic in the Extensions panel. It gives you the same Claude, but inside your editor. You see its changes as a side-by-side diff before you accept them. It knows which file you have open and which lines you have selected, so you can say "fix this" and it knows what "this" is. You can also point it at a file with an @ mention. It's the same agent and the same settings, just with a friendlier window, so everything in today's talk works there too.

And it isn't only for your own machine. You can run Claude Code in CI, the build pipeline, with no human at the keyboard. Run `claude -p "your task"` for a one-shot, non-interactive run, and use the Claude Code GitHub Action to let it review pull requests or fix issues when someone mentions `@claude`. In GitHub, you can set that up by running `/install-github-app` inside Claude Code. You give it an API key as a secret, and it works inside the pipeline. The same CLAUDE.md, skills and hooks we'll cover today apply there too, so your team's rules follow Claude everywhere.

## Slide 3: Start with a better setup

For anyone new: CLAUDE.md is a plain text file in your project that Claude reads at the start of every session. It is how you tell Claude about your project: how to build it, how to run tests, what your team's rules are. Without it, Claude starts from zero every time. You create it by typing `/init`, which is a slash command, a shortcut you type inside Claude Code. The catch is that the default `/init` writes down everything it sees, which makes the file bloated, and a long file is a file that gets ignored. The better `/init` asks you questions first, then writes a lean file. One rule to remember: CLAUDE.md only holds what Claude can't work out by reading the code. If you're moving from Codex or Cursor, `/import` brings your old setup across. And `/powerup` gives you short interactive lessons, inside Claude Code itself.

## Slide 4: Better plan mode

Plan mode makes Claude think before it types. Three settings improve it. One clears the chat when you approve the plan, so building starts with only the plan. One saves plans inside your repo, so the team can see them. And `opusplan` lets the strongest model do the planning while a cheaper model does the building. You don't have to edit settings.json by hand. You can just ask Claude to add them for you.

## Slide 5: Slash commands you'll use daily

Three groups. Context commands manage what Claude remembers: `/clear` for a fresh start, `/compact` to shrink the chat, `/rewind` to undo. Session commands manage the conversation: resume an old one, switch model, check cost. Setup commands manage the layers we're about to cover: agents, hooks and MCP each have their own. Type `/` in the prompt box and you'll see them all.

## Slide 6: Custom commands: write your own

A custom command is just a markdown file. Put it in `.claude/commands/` and the file name becomes the command. Whatever you type after it replaces `$ARGUMENTS`. So `/fix-item 4821` runs my whole "fix a work item" routine on item 4821. Commit the file and the whole team has the same command.

## Slide 7: Skills: reusable playbooks

A skill is a folder with a `SKILL.md` file. You can run it yourself as `/name`, or Claude can pick it up on its own when the task matches. The key point is that it's loaded only when needed, so your CLAUDE.md stays short and the detail lives in skills. The description line matters most, because that's how Claude decides when to use the skill.

## Slide 8: Subagents: specialists

A subagent is a helper with its own memory, its own instructions and its own tools. It can read 40 files and your main chat only gets the summary back, so your session stays clean. You can also run several at once: one explores, one reviews, one tests. For a reviewer, give it read-only tools, so it can't edit your code.

## Slide 9: Hooks run every time

A line in CLAUDE.md is a request. The model usually follows it, but not always. A hook is plain code that runs automatically at set moments, like after every edit. Claude doesn't even know it's there. That's the point: it happens every single time.

## Slide 10: Hooks in practice

First example: after every edit, run `dotnet format`. No prompt needed. Second example: before an edit, a small script checks the file path, and if it's the production config, it exits with code 2. The edit is blocked and Claude is told why. Both live in `.claude/settings.json`, so committing the file gives the whole team the same rules.

## Slide 11: MCP and plugins

MCP connects Claude to the places your work lives: work items, databases, internal docs. A plugin bundles skills, subagents, hooks and MCP servers into one installable unit. Install it from a marketplace and everybody on the team gets the same setup. Plugin commands are namespaced, so several plugins can live together without clashing.

## Slide 12: One repo, one story

Here's the whole session as one pipeline. A skill builds the feature. A subagent reviews it. A hook formats every edit. A plugin ships the whole setup to the team. The plugin is the moment this stops being one person's setup and becomes the team's. *(When the recap fades and the browser opens:)* Everything we just covered is in the official docs at code.claude.com/docs, under "Extend Claude Code." Features change often, so that is the place to stay current. *(When the browser closes:)* Thank you. Anuja will now take you through all of this in a live demo.
