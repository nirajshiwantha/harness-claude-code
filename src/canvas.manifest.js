export const manifest = {
  screens: {
    scr_7pnir0: { name: "Harnessing Claude Code", route: "/", state: { "slideIndex": 0 }, position: { "x": 160, "y": 220 } },
    scr_ag3nda: { name: "Agenda", route: "/", state: { "slideIndex": 1 }, position: { "x": 1560, "y": 220 } },
    scr_setup1: { name: "Start with a better setup", route: "/", state: { "slideIndex": 2 }, position: { "x": 160, "y": 2200 } },
    scr_plan01: { name: "Better plan mode", route: "/", state: { "slideIndex": 3 }, position: { "x": 1560, "y": 2200 } },
    scr_slash1: { name: "Slash commands you’ll use daily", route: "/", state: { "slideIndex": 4 }, position: { "x": 2960, "y": 2200 } },
    scr_cmds01: { name: "Custom commands: write your own", route: "/", state: { "slideIndex": 5 }, position: { "x": 4360, "y": 2200 } },
    scr_skill1: { name: "Skills", route: "/", state: { "slideIndex": 6 }, position: { "x": 160, "y": 4180 } },
    scr_subag1: { name: "Subagents", route: "/", state: { "slideIndex": 7 }, position: { "x": 160, "y": 6160 } },
    scr_hooks2: { name: "Hooks", route: "/", state: { "slideIndex": 8 }, position: { "x": 160, "y": 8140 } },
    scr_mcp001: { name: "MCP and plugins", route: "/", state: { "slideIndex": 9 }, position: { "x": 160, "y": 10120 } },
    scr_story1: { name: "One repo, one story", route: "/", state: { "slideIndex": 10 }, position: { "x": 160, "y": 12100 } }
  },
  sections: {
    sec_b4l7j6: { name: "Introduction & Overview", x: 0, y: 0, width: 2920, height: 1180 },
    sec_29co0c: { name: "Setup & Commands", x: 0, y: 1980, width: 5720, height: 1180 },
    sec_eiqt45: { name: "Skills & Reusability", x: 0, y: 3960, width: 1520, height: 1180 },
    sec_5g8p2m: { name: "Subagents & Specialists", x: 0, y: 5940, width: 1520, height: 1180 },
    sec_ypcf83: { name: "Hooks System", x: 0, y: 7920, width: 1520, height: 1180 },
    sec_wo7rn8: { name: "Scaling Up", x: 0, y: 9900, width: 1520, height: 1180 },
    sec_cgrya5: { name: "Wrap-up", x: 0, y: 11880, width: 1520, height: 1180 }
  },
  layers: [
  { kind: "section", id: "sec_b4l7j6", children: [
    { kind: "screen", id: "scr_7pnir0" },
    { kind: "screen", id: "scr_ag3nda" }]
  },
  { kind: "section", id: "sec_29co0c", children: [
    { kind: "screen", id: "scr_setup1" },
    { kind: "screen", id: "scr_plan01" },
    { kind: "screen", id: "scr_slash1" },
    { kind: "screen", id: "scr_cmds01" }]
  },
  { kind: "section", id: "sec_eiqt45", children: [
    { kind: "screen", id: "scr_skill1" }]
  },
  { kind: "section", id: "sec_5g8p2m", children: [
    { kind: "screen", id: "scr_subag1" }]
  },
  { kind: "section", id: "sec_ypcf83", children: [
    { kind: "screen", id: "scr_hooks2" }]
  },
  { kind: "section", id: "sec_wo7rn8", children: [
    { kind: "screen", id: "scr_mcp001" }]
  },
  { kind: "section", id: "sec_cgrya5", children: [
    { kind: "screen", id: "scr_story1" }]
  }]

};
