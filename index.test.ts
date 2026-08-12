import assert from "node:assert/strict";
import test from "node:test";
import clearScreen from "./index.ts";

type SessionStartHandler = (event: { reason: string }, ctx: any) => Promise<void>;

function loadHandler(): SessionStartHandler {
  let handler: SessionStartHandler | undefined;
  clearScreen({
    on(event: string, callback: SessionStartHandler) {
      assert.equal(event, "session_start");
      handler = callback;
    },
  } as any);
  assert.ok(handler);
  return handler;
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
    const handler = loadHandler();
    const { calls, ctx } = createContext();

    await handler({ reason }, ctx);

    assert.deepEqual(calls, ["clearScreen", "renderNow:true", "done"]);
  });
}

for (const reason of ["reload", "resume", "fork"]) {
  test(`does not clear for ${reason}`, async () => {
    const handler = loadHandler();
    const { calls, ctx } = createContext();

    await handler({ reason }, ctx);

    assert.deepEqual(calls, []);
  });
}

for (const mode of ["rpc", "json", "print"]) {
  test(`does not clear in ${mode} mode`, async () => {
    const handler = loadHandler();
    const { calls, ctx } = createContext(mode);

    await handler({ reason: "startup" }, ctx);

    assert.deepEqual(calls, []);
  });
}
