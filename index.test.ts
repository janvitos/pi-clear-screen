import assert from "node:assert/strict";
import test from "node:test";
import clearScreen from "./index.ts";

type SessionStartHandler = (event: { reason: string }, ctx: any) => Promise<void>;
function loadExtension() {
  let sessionStart: SessionStartHandler | undefined;

  clearScreen({
    on(event: string, callback: SessionStartHandler) {
      assert.equal(event, "session_start");
      sessionStart = callback;
    },
  } as any);

  assert.ok(sessionStart);
  return { sessionStart };
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
