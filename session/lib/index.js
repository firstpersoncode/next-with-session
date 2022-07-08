import { render } from "react-dom";
import Session from "./client";

async function initSession(req, res, configs) {
  const sessionClient = new Session(req, res, configs);
  let session;
  let token = req.cookies[configs.name];
  if (!token) session = await sessionClient.create();
  else session = await sessionClient.fetch();

  return session;
}

export function withSessionGetServerSideProps(handler, configs) {
  return async ({ req, res, ...nextContext }) => {
    req.session = await initSession(req, res, configs);

    if (req.session.events?.length) await req.session.cleanEvents();
    else {
      const renderEvent = req.session.getEvent("render");
      if (!renderEvent)
        req.session.createEvent({
          ref: "render",
          maxAge: 100,
          event: "Rendering the page !",
        });
    }

    req.session.commitCookies();

    return handler({ ...nextContext, req, res });
  };
}

export function withSession(handler, configs) {
  return async (req, res, ...rest) => {
    req.session = await initSession(req, res, configs);

    if (req.session.events?.length) await req.session.cleanEvents();

    req.session.commitCookies();

    return handler(req, res, ...rest);
  };
}
