import { parse } from "next-useragent";
import { add, isAfter } from "date-fns";
import { sign, verify } from "jsonwebtoken";
import nookies from "nookies";

export default class Session {
  constructor(configs, ctx) {
    this.name = configs.name;
    this.maxAge = configs.maxAge;
    this.expiresIn = add(new Date(), { seconds: configs.maxAge });
    this.cookies = [];
    this.secretKey = process.env.SESSION_SECRET_KEY;

    if (typeof ctx !== "undefined") {
      this.ctx = ctx;
      this.ipAddress =
        ctx.req.headers["x-forwarded-for"]?.split(",").shift() ||
        ctx.req.socket?.remoteAddress;

      this.userAgent = ctx.req.headers["user-agent"];
    } else if (typeof window !== "undefined") {
      this.userAgent = window.navigator?.userAgent;
    }

    this.session = {};
  }

  init() {
    this.session = this._getSession();
    if (!this.session) {
      this.session = this._setSession();
      this._encodeSession();
    }

    return this.session;
  }

  _setSession() {
    const parsedUa = parse(this.userAgent);

    const userAgent = {
      source: this.userAgent,
      deviceType: parsedUa.deviceType || null,
      deviceVendor: parsedUa.deviceVendor || null,
      os: parsedUa.os || null,
      osVersion: parsedUa.osVersion || null,
      browser: parsedUa.browser || null,
      browserVersion: parsedUa.browserVersion || null,
      isBot: parsedUa.isBot,
    };

    const session = {
      name: this.name,
      event: { ...userAgent, ipAddress: this.ipAddress },
      expiresIn: this.expiresIn,
    };

    this.session = session;
    this.session.events = this._getEvents();

    return {
      ...this.session,
      setEvent: this._setEvent.bind(this),
      getEvent: this._getEvent.bind(this),
      deleteEvent: this._deleteEvent.bind(this),
      commit: (session) => this._encodeSession(session),
      parse: () => this._parseSession(this.session),
    };
  }

  _getSession() {
    this.session = this._decodeSession();
    if (!this.session) return;

    this.session.events = this._getEvents();

    return {
      ...this.session,
      setEvent: this._setEvent.bind(this),
      getEvent: this._getEvent.bind(this),
      deleteEvent: this._deleteEvent.bind(this),
      commit: (session) => this._encodeSession(session),
      parse: this._parseSession.bind(this),
    };
  }

  _parseSession(session) {
    if (!session) {
      session = this._decodeSession();
      if (!session) return;
    }

    this.session = session;
    this.session.events = this._getEvents();

    return JSON.parse(JSON.stringify(this.session));
  }

  _encodeSession(session) {
    const token = sign(session || this.session, this.secretKey);

    nookies.set(this.ctx, this.name, token, {
      maxAge: this.maxAge,
      path: "/",
    });
  }

  _decodeSession() {
    const tokenObjects = this._getTokens();

    const token = tokenObjects.find((token) => token.name === this.name);
    if (!token) return;
    // if (!token) get session from db matched with ip address

    try {
      const obj = verify(token.value, this.secretKey);
      return obj;
    } catch (err) {
      return;
    }
  }

  _getTokens() {
    const tokens = nookies.get(this.ctx);
    const tokenObjects = Object.entries(tokens).map(([name, value]) => ({
      name,
      value,
    }));

    return tokenObjects;
  }

  _setEvent(name, { maxAge = 60, event }) {
    const expiresIn = add(new Date(), { seconds: maxAge });

    const newEvent = {
      name: `${this.name}.${name}`,
      event,
      expiresIn,
    };

    let events = this._getEvents();
    const dup = this._getEvent(name);

    if (dup) {
      events = events.map((e) => {
        if (e.name === dup.name) {
          return { ...e, ...newEvent };
        }
        return e;
      });
      // update event in db
    } else {
      events = [...events, newEvent];
      // save event in db
    }

    this.session.events = events;
  }

  _deleteEvent(name) {
    let events = this._getEvents();
    this.session.events = events.filter(
      (e) => e.name !== `${this.name}.${name}`
    );
    // delete event from db
  }

  _getEvent(name) {
    let events = this._getEvents();
    return events.find((e) => e.name === `${this.name}.${name}`);
  }

  _getEvents() {
    if (!this.session?.events?.length) return [];

    const events = this.session.events.filter((e) => {
      if (isAfter(new Date(), new Date(e.expiresIn))) {
        // delete event from db
        return false;
      }
      return e;
    });

    return events;
  }
}
