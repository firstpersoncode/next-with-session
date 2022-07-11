import { SessionContextProvider, useSessionContext } from "./lib/client";
import Session from "./lib/server";

function initSession(configs, ctx) {
  const sessionClient = new Session(configs, ctx);
  return sessionClient.init();
}

export function withSessionSsr(handler, configs) {
  return async (ctx) => {
    ctx.req.session = initSession(configs, ctx);
    const returnHandler = await handler(ctx);

    return {
      ...returnHandler,
      props: {
        ...returnHandler.props,
        session: ctx.req.session.parse(),
      },
    };
  };
}

export function withSession(handler, configs) {
  return (req, res, ...rest) => {
    // validate session here ...
    req.session = initSession(configs, { req, res });

    return handler(req, res, ...rest);
  };
}

export { SessionContextProvider, useSessionContext };
