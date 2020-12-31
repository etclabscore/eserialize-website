import openrpcDocument from "../openrpc.json";
import * as eserialize from "@etclabscore/eserialize";

window.addEventListener("message", async (ev: MessageEvent) => {
  const evSource: any = ev.source;
  if (!ev.data.jsonrpc) {
    return;
  }
  if (ev.data.method === "rpc.discover") {
    evSource.postMessage({
      jsonrpc: "2.0",
      result: openrpcDocument,
      id: ev.data.id,
    }, ev.origin);
    return;
  }
  const otherEserialize: any = eserialize;
  if (!otherEserialize[ev.data.method]) {
    evSource.postMessage({
      jsonrpc: "2.0",
      error: {
        code: 32009,
        message: "Method not found",
      },
      id: ev.data.id,
    }, ev.origin);
    return;
  }
  try {
    const results = otherEserialize[ev.data.method](...ev.data.params);
    evSource.postMessage({
      jsonrpc: "2.0",
      result: results,
      id: ev.data.id,
    }, ev.origin);
  } catch (e) {
    evSource.postMessage({
      jsonrpc: "2.0",
      error: {
        code: 32329,
        message: e.message,
      },
      id: ev.data.id,
    }, ev.origin);
  }
});

export default {};
