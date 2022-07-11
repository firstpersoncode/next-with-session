// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { withSession } from "../../session";
import sessionConfigs from "../../utils/sessionConfigs";

export default withSession(function handler(req, res) {
  const { message } = req.body;

  if (!req.session.getEvent("first-message")) {
    req.session.setEvent("first-message", {
      maxAge: 60,
      event: { message },
    });
  }

  req.session.setEvent("receive-message", {
    maxAge: 60,
    event: { message },
  });

  req.session.commit();

  res.status(200).send("ok");
}, sessionConfigs());
