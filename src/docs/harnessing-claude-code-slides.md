# Harnessing Claude Code — Slide Content

Each slide has its on-slide content, then the speaker notes.

---

## Slide 1 — Cover

**$ claude**

# Harnessing Claude Code
From better setup and hidden settings to agents

Niraj Ranasinghe · 28 October 2026

> **Speaker notes:** Welcome. Everyone here already uses Claude Code, so we skip installs and basics. Goal: go from the settings most people skip to the features that turn Claude Code into an agent system you can share with the team.

---

## Slide 2 — Agenda

| # | Topic | Focus |
|---|---|---|
| 1 | Setup and commands | Better /init, plan mode, slash and custom commands |
| 2 | Skills | Reusable playbooks |
| 3 | Subagents | Specialists with their own context |
| 4 | Hooks | Rules that always run |
| 5 | Scaling up | MCP and plugins |
| 6 | Wrap-up | One story that ties it together |

> **Speaker notes:** Each level builds on the last, and the demos all happen in one repo so it becomes a single story by the end. Pace it to the room: the settings slides are quick wins; the skills, subagents and hooks slides are where to spend demo time.

---

## Slide 3 — Start with a better setup

**Better /init**
`CLAUDE_CODE_NEW_INIT=1 claude`
/init asks how you work (Git, deploys, skills, hooks), shows a plan, then writes a lean CLAUDE.md plus starter skills and hooks.

**Learn in place**
`/powerup`
Short lessons inside Claude Code, each with an animated demo of one feature.

**Rule of thumb:** CLAUDE.md holds only what Claude can't learn by reading the code.

> **Speaker notes:** The default /init reads the project and writes down everything it learns, which bloats CLAUDE.md. Set the environment variable before typing `claude` so the session picks it up; /init then interviews you instead (improve current setup or start fresh, Git usage, deployment). Command and variable names come from a community walkthrough: try each on your Claude Code version before demoing.

---

## Slide 4 — Better plan mode

| Command | What it does |
|---|---|
| `/model opusplan` | Opus plans, Sonnet builds: stronger plans, less of your usage limit |
| `/advisor` | Adds a stronger reviewer model that Claude consults before big decisions and before it finishes |

> **Speaker notes:** opusplan matters most on the Pro plan, where limits are hit faster. The advisor sees the whole conversation, so it can catch a wrong turn early, before Claude builds on it.

---

## Slide 5 — Slash commands you’ll use daily

**Context**
- `/clear` — fresh context for a new task
- `/compact` — summarise and keep going
- `/context` — see what fills the window
- `/rewind` — roll back code and chat to a checkpoint

**Session**
- `/resume` — pick up a past session
- `/model` — switch model mid-session
- `/cost` — tokens and spend so far
- `/status` — version, model and account

**Setup**
- `/memory` — edit your CLAUDE.md files
- `/permissions` — allow and deny rules
- `/agents` · `/hooks` · `/mcp` — manage each layer
- `/doctor` — check your install

Type **/** in the prompt box to see every command, including your own and your plugins’.

> **Speaker notes:** A quick tour, not a demo of each one. The Setup column previews the layers coming up later: agents, hooks and MCP each have their own command.

---

## Slide 6 — Custom commands: write your own

- A markdown file in `.claude/commands/` becomes **/name**
- `$ARGUMENTS` is whatever you type after the command
- Frontmatter sets `description`, `allowed-tools` and `model`
- **Run it:** `/fix-item 4821` — then commit it for the team

`.claude/commands/fix-item.md`
```markdown
---
description: Fix a work item end to end
allowed-tools: Read, Edit, Bash(dotnet:*)
---
Fix Azure DevOps item #$ARGUMENTS.
1. Read the item and find the code
2. Write a failing test, then fix it
3. Run dotnet test
4. Commit with "Fixes #$ARGUMENTS"
```

> **Speaker notes:** A command is one prompt file. When the playbook needs scripts, templates or several files, reach for a skill instead, which is the next level.

---

## Slide 7 — Skills

- A folder with a **SKILL.md**, run as **/name** by you or picked up by Claude
- Project: `.claude/skills/<name>/` · Personal: `~/.claude/skills/<name>/`
- Loaded only when needed, so keep CLAUDE.md short and push detail here

```markdown
---
name: add-endpoint
description: Add an API endpoint the way our team builds them
---
1. Dapper repository method + SQL
2. Controller action with validation
3. xUnit test for the happy path
4. Run dotnet build and dotnet test
```

> **Speaker notes:** Skills are the most flexible extension. Reference skills hold knowledge (an API style guide); action skills run a workflow. Have this SKILL.md ready, then run it live on a small endpoint. The description matters: it is how Claude decides when to use the skill.

---

## Slide 8 — Subagents

- **Own context window:** it reads 40 files, your session gets back only the summary
- **Own instructions and tools,** and it can preload skills
- **Run several in parallel:** explore, review, test

`.claude/agents/code-reviewer.md`
```markdown
---
name: code-reviewer
description: Reviews changes for bugs, security and our conventions
tools: Read, Grep, Glob
---
You are a senior .NET reviewer.
Report findings by severity.
Do not edit files.
```

> **Speaker notes:** The main win is context isolation: the main session stays clean. Read-only tools make the reviewer safe. Ask it to review the endpoint from the skills demo so the story connects.

---

## Slide 9 — Hooks

Hooks run every time, whatever the model decides.

**PostToolUse · after every edit — Format code automatically**
```json
"PostToolUse": [{
  "matcher": "Edit|Write",
  "hooks": [{ "type": "command", "command": "dotnet format" }]
}]
```

**PreToolUse · before an edit — Block prod config changes**
A script checks the target path and exits with code 2 for appsettings.Production.json. The edit is blocked and Claude sees why.

Lives in **.claude/settings.json**. Commit it so the whole team gets the same rules.

> **Speaker notes:** This is usually the aha moment. A prompt or CLAUDE.md line is a request the model may or may not follow; a hook is plain code wired to lifecycle events, so it is deterministic. Claude doesn't even know hooks exist, and that is the point. Show both live: make an edit and watch formatting happen with no prompt, then ask Claude to change the production config and watch it get blocked. Personal hooks go in ~/.claude/settings.json; settings.local.json is for your own untracked overrides.

---

## Slide 10 — MCP and plugins

**MCP — Connects Claude to your systems**
- Azure DevOps work items and pipelines
- Databases for schema-aware queries
- Internal docs and APIs
- Add with `claude mcp add`, or share a `.mcp.json` in the repo

**Plugins — Packages it all for the team**
- One installable unit: skills, subagents, hooks, MCP servers
- Namespaced commands, e.g. `/team-dotnet:review`
- Install from a marketplace, so everyone gets the same setup

> **Speaker notes:** MCP gives the teammate access; plugins are how a team standardizes. Show a plugin folder that contains the skill, subagent and hook from the earlier demos. Namespacing means several plugins can coexist without command clashes.

---

## Slide 11 — One repo, one story (Recap)

**Skill** (/add-endpoint builds the feature) → **Subagent** (code-reviewer checks it) → **Hook** (dotnet format cleans every edit) → **Plugin** (ships the whole setup to the team)

> **Speaker notes:** Prepare the skill, subagent and hook files beforehand; live-type only small edits so you stay on time. Recap the whole session as one pipeline. Each piece built on the last, and the plugin is how this stops being one person's setup and becomes the team's.

After 10 seconds the recap cards and arrows lift, blur and fade away one by one, starting from the last card. The first card goes last, taking the "Recap" label and heading with it. Two seconds later a browser window opens over the slide: a cursor clicks the search box, types `code.claude.com/docs`, presses Enter, and the docs page loads and scrolls through CLAUDE.md, Skills, Subagents, Hooks, MCP and Plugins in about 5 seconds. The browser closes and, after a short beat, the closing line types in:

**Up next**

# Let’s go to the demo.

Docs: code.claude.com/docs — see "Extend Claude Code"
