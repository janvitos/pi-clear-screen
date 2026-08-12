import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const CLEAR_REASONS = new Set(["startup", "new"]);

export default function clearScreen(pi: ExtensionAPI) {
  pi.on("session_start", async (event, ctx) => {
    if (!CLEAR_REASONS.has(event.reason) || ctx.mode !== "tui") return;

    await ctx.ui.custom<void>((tui, _theme, _keybindings, done) => {
      tui.terminal.clearScreen();
      tui.renderNow(true);
      done();

      return {
        render: () => [],
        invalidate: () => {},
      };
    });
  });
}
