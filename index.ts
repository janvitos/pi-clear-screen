import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";

const CLEAR_REASONS = new Set(["startup", "new"]);

async function clearViewport(ctx: ExtensionContext): Promise<void> {
  if (ctx.mode !== "tui") return;

  await ctx.ui.custom<void>((tui, _theme, _keybindings, done) => {
    tui.terminal.clearScreen();
    tui.renderNow(true);
    done();

    return {
      render: () => [],
      invalidate: () => {},
    };
  });
}

export default function clearScreen(pi: ExtensionAPI) {
  pi.on("session_start", async (event, ctx) => {
    if (!CLEAR_REASONS.has(event.reason)) return;
    await clearViewport(ctx);
  });

  pi.registerCommand("clear", {
    description: "Start a new session and clear the screen",
    handler: async (_args, ctx) => {
      await ctx.newSession();
    },
  });
}
