import assert from "node:assert/strict";
import test from "node:test";
import clearScreen from "./index.ts";

type SessionStartHandler = (event: { reason: string }, ctx: any) => Promise<void>;
type CommandHandler = (args: string, ctx: any) => Promise<void>;

function loadExtension() {
  let sessionStart: SessionStartHandler | undefined;
  let command: { description: string; handler: CommandHandler } | undefined;

  clearScreen({
    on(event: string, callback: SessionStartHandler) {
      assert.equal(event, "session_start");
      sessionStart = callback;
    },
    registerCommand(name: string, options: { description: string; handler: CommandHandler }) {
      assert.equal(name, "clear");
      command = options;
    },
  } as any);

  assert.ok(sessionStart);
  assert.ok(command);
  return { sessionStart, command };
}

function createContext(mode = "tui") {
  const calls: string[] = [];
  const tui = {
    terminal: {
      clearScreen() {
        calls.push("clearScreen");
      },
    },
    renderNow(force: boolean) {
      calls.push(`renderNow:${force}`);
    },
  };

  return {
    calls,
    ctx: {
      mode,
      async newSession() {
        calls.push("newSession");
        return { cancelled: false };
      },
      ui: {
        async custom(factory: Function) {
          const done = () => calls.push("done");
          const component = factory(tui, {}, {}, done);
          assert.deepEqual(component.render(), []);
          component.invalidate();
        },
      },
    },
  };
}

for (const reason of ["startup", "new"]) {
  test(`clears and force-redraws for ${reason}`, async () => {
    const { sessionStart } = loadExtension();
    const { calls, ctx } = createContext();

    await sessionStart({ reason }, ctx);

    assert.deepEqual(calls, ["clearScreen", "renderNow:true", "done"]);
  });
}

for (const reason of ["reload", "resume", "fork"]) {
  test(`does not clear for ${reason}`, async () => {
    const { sessionStart } = loadExtension();
    const { calls, ctx } = createContext();

    await sessionStart({ reason }, ctx);

    assert.deepEqual(calls, []);
  });
}

for (const mode of ["rpc", "json", "print"]) {
  test(`does not clear in ${mode} mode`, async () => {
    const { sessionStart } = loadExtension();
    const { calls, ctx } = createContext(mode);

    await sessionStart({ reason: "startup" }, ctx);

    assert.deepEqual(calls, []);
  });
}

test("registers /clear as a new-session alias", async () => {
  const { command } = loadExtension();
  const { calls, ctx } = createContext();

  assert.equal(command.description, "Start a new session and clear the screen");
  await command.handler("", ctx);

  assert.deepEqual(calls, ["newSession"]);
});
