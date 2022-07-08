import { parse } from "next-useragent";
import { add } from "date-fns";
import { sign, verify } from "jsonwebtoken";

import serializeToken from "../utils/serialize";

export default class Session {
  constructor(req, res, configs) {
    this.req = req;
    this.res = res;
    this.configs = configs;
    this.session = {};
    this.cookies = [];
  }

  setCookies({ name, token, maxAge, exp }) {
    const cookie = serializeToken(
      name || this.configs.name,
      token,
      maxAge || this.configs.maxAge,
      exp
    );

    this.cookies.push(cookie);
  }
  commitCookies() {
    if (!this.cookies.length) return;
    this.res.setHeader("Set-Cookie", this.cookies.join());
  }
  setSession(session) {
    this.session = {
      ...this.session,
      ...session,
    };
  }
  getSession() {
    return {
      ...this.session,
      destroy: this.destroy.bind(this),
      cleanEvents: this.cleanEvents.bind(this),
      createEvent: this.createEvent.bind(this),
      getEvent: this.getEvent.bind(this),
      commitCookies: this.commitCookies.bind(this),
      parseSession: this.parseSession.bind(this),
    };
  }
  parseSession() {
    return JSON.parse(JSON.stringify(this.session));
  }
  fetch() {
    const token = this.req.cookies[this.configs.name];
    if (!token) return null;
    const session = verify(token, process.env.SESSION_SECRET_KEY);
    const events = 
    this.setSession({ ...session, token });
    return this.getSession();
  }
  create() {
    const uaString = this.req.headers["user-agent"];
    const parsedUa = parse(uaString);

    const exp = add(new Date(), { seconds: this.configs.maxAge });

    const session = {
      source: uaString,
      deviceType: parsedUa.deviceType || null,
      deviceVendor: parsedUa.deviceVendor || null,
      os: parsedUa.os || null,
      osVersion: parsedUa.osVersion || null,
      browser: parsedUa.browser || null,
      browserVersion: parsedUa.browserVersion || null,
      isBot: parsedUa.isBot,
      expiresIn: exp,
    };

    const token = sign(session, process.env.SESSION_SECRET_KEY, {
      expiresIn: this.configs.maxAge,
    });

    this.setSession({ ...session, token });

    this.setCookies({ token, exp });

    return this.getSession();
  }
  destroy() {
    if (!this.session.token) throw new Error("Cannot destroy empty Session");
    this.setSession({ token: null, expiresIn: new Date() });
    this.setCookies({ token: null, maxAge: -1 });
  }
  cleanEvents() {
    if (!this.session.token) throw new Error("Cannot clean empty session");
    if (!this.session.events?.length)
      throw new Error("Cannot clean empty Events");

    const expiredEvents = (event) =>
      event.start && isAfter(new Date(), new Date(event.expiresIn));

    const expired = this.session.events.filter(expiredEvents);

    if (expired.length) {
      for (const event of expired) {
        this.setCookies({
          name: `${this.configs.name}.${event.ref}`,
          token: null,
          maxAge: -1,
        });
      }
    }

    this.setSession({
      events: this.session.events.filter((event) => !expiredEvents(event)),
    });
  }
  createEvent({ maxAge = 60, ref, event }) {
    if (!this.session) throw new Error("Cannot create empty Session");

    const exp = add(new Date(), { seconds: maxAge });

    const newEvent = {
      ref,
      event,
      expiresIn: exp,
    };

    const token = sign(newEvent, process.env.SESSION_SECRET_KEY, {
      expiresIn: maxAge,
    });

    this.setCookies({
      name: `${this.configs.name}.${ref}`,
      token,
      maxAge,
      exp,
    });

    const newEvents = [...(this.session.events || []), { ...newEvent, token }];
    this.setSession({ events: newEvents });
  }
  getEvent(ref) {
    if (!this.session) throw new Error("Cannot find event for empty Session");
    const token = this.req.cookies[`${this.configs.name}.${ref}`];
    if (!token) return null;

    const event = verify(token, process.env.SESSION_SECRET_KEY);

    return event;
  }
}
