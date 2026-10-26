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
| 2 | Skills | Reusable playbooks, kept lean |
| 3 | Subagents | Specialists with their own context |
| 4 | Hooks | Rules that always run |
| 5 | Scaling up | MCP, plugins, many sessions at once |
| 6 | Wrap-up | One story, homework, Q&A |

> **Speaker notes:** Each level builds on the last, and the demos all happen in one repo so it becomes a single story by the end. Pace it to the room: the settings slides are quick wins; the skills, subagents and hooks slides are where to spend demo time.

---

## Slide 3 — Start with a better setup

**Better /init**
`CLAUDE_CODE_NEW_INIT=1 claude`
/init asks how you work (Git, deploys, skills, hooks), shows a plan, then writes a lean CLAUDE.md plus starter skills and hooks.

**Import a setup**
`/import codex` · `/import cursor`
Lists the instruction files and MCP servers from your old agent. Pick what to bring; Claude copies it over.

**Learn in place**
`/powerup`
Short lessons inside Claude Code, each with an animated demo of one feature.

**Rule of thumb:** CLAUDE.md holds only what Claude can't learn by reading the code.

> **Speaker notes:** The default /init reads the project and writes down everything it learns, which bloats CLAUDE.md. Set the environment variable before typing `claude` so the session picks it up; /init then interviews you instead (improve current setup or start fresh, Git usage, deployment). Command and variable names come from a community walkthrough: try each on your Claude Code version before demoing.

---

## Slide 4 — Better plan mode

| Setting | What it does |
|---|---|
| `"showClearContextOnPlanAccept": true` | Brings back "clear context" when you approve a plan, so building starts with only the plan |
| `"plansDirectory": "./plans"` | Saves plans in the repo instead of ~/.claude/plans, so the team can see and commit them |
| `/model opusplan` | Opus plans, Sonnet builds: stronger plans, less of your usage limit |

Settings live in **settings.json**. You can simply ask Claude to add them for you.

> **Speaker notes:** Clearing context after planning drops all the back-and-forth, but the plan itself is kept as a file. Some references say plansDirectory is not accepted in the shared project settings file, so if it is ignored there, put it in your user or local settings. opusplan matters most on the Pro plan, where limits are hit faster.

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

## Slide 7 — Skills: reusable playbooks

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

## Slide 8 — Keep the setup lean

Instructions written for older models, and skills nobody uses, still eat context.

**`/claude-api prompt-audit`**
Subagents check every CLAUDE.md and skill, then report what's outdated with suggested fixes. Run it after each new model.

**`/skill-doctor`**
How often each skill runs, when it last ran, and how many tokens it costs.

**`/skills`, then press T**
Lists every skill, sorted by token size.

> **Speaker notes:** Follows naturally from writing skills: once you have a few, maintain them. Use the audit report, then ask Claude to apply the fixes and delete unused skills. Exact command names are from a community walkthrough: confirm on your version.

---

## Slide 9 — Subagents: specialists

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

## Slide 10 — Hooks (statement slide)

# Hooks run every time, whatever the model decides.

Claude doesn't even know they exist. That's the point.

> **Speaker notes:** This is usually the aha moment. A prompt or CLAUDE.md line is a request the model may or may not follow. A hook is plain code wired to lifecycle events, so it is deterministic.

---

## Slide 11 — Hooks in practice

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

> **Speaker notes:** Show both live: make an edit and watch formatting happen with no prompt, then ask Claude to change the production config and watch it get blocked. Personal hooks go in ~/.claude/settings.json; settings.local.json is for your own untracked overrides.

---

## Slide 12 — MCP and plugins

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

## Slide 13 — Many sessions at once

**Sessions talk** — `/list-agents`
See which sessions you can reach, then ask one session to message another. It gets the answer even while the other is still working.

**Don't get stuck** — `"askUserQuestionTimeout": 60`
After the timeout Claude takes the suggested answer and keeps going, unless it truly needs you.

**Know who needs you** — `/config` → Local notifications
Pick terminal bell or another option to hear when Claude is done or waiting.

> **Speaker notes:** Each session normally knows only its own chat. With these three, parallel sessions share answers, keep moving when you're away, and tell you when they need you. Confirm the timeout key on your version.

---

## Slide 14 — One repo, one story

**Skill** (/add-endpoint builds the feature) → **Subagent** (code-reviewer checks it) → **Hook** (dotnet format cleans every edit) → **Plugin** (ships the whole setup to the team)

> **Speaker notes:** Prepare the skill, subagent and hook files beforehand; live-type only small edits so you stay on time. Recap the whole session as one pipeline. Each piece built on the last, and the plugin is how this stops being one person's setup and becomes the team's.

---

## Slide 15 — Closing

**Your homework**

# Write one skill for something you repeat every week.

After 5.6 seconds the headline is deleted with a typing effect. A browser window then opens over the slide: a cursor clicks the search box, types `code.claude.com/docs`, presses Enter, and the docs page loads and scrolls through CLAUDE.md, Skills, Subagents, Hooks, MCP and Plugins in about 5 seconds. The browser closes and the new headline types in:

**Up next**

# Let’s go to the demo.

Docs: code.claude.com/docs — see "Extend Claude Code"

> **Speaker notes:** One small concrete task beats a long reading list. Features change often, so point people to the docs rather than memorizing details.
