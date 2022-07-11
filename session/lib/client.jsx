import { add } from "date-fns";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import Session from "./server";

const context = {};

const SessionContext = createContext(context);

const useContextController = (initialContext = context, configs) => {
  const [session, setSession] = useState(initialContext);
  const sessionClient = useRef(new Session(configs));

  const getSessionApis = () => sessionClient.current?.init();

  const getEvent = useCallback(
    (name) => {
      return session.events.find((e) => e.name === `${session.name}.${name}`);
    },
    [session]
  );

  const setEvent = useCallback(
    (name, { maxAge, event }) => {
      const expiresIn = add(new Date(), { seconds: maxAge });

      const newEvent = {
        name: `${session.name}.${name}`,
        event,
        expiresIn,
      };

      const currSession = session;
      const dup = getEvent(name);

      if (dup) {
        currSession.events = currSession.events.map((e) => {
          if (e.name === dup.name) {
            return { ...e, ...newEvent };
          }
          return e;
        });
      } else currSession.events = [...currSession.events, newEvent];

      setSession(currSession);
    },
    [session, getEvent]
  );

  const deleteEvent = useCallback(
    (name) => {
      const currSession = session;
      currSession.events = currSession.events.filter(
        (e) => e.name !== `${session.name}.${name}`
      );

      setSession(currSession);
    },
    [session]
  );

  const commit = () => {
    const s = getSessionApis();
    s.commit(session);
    setSession(s.parse());
  };

  return {
    session,
    getEvent,
    setEvent,
    deleteEvent,
    commit,
  };
};

export function SessionContextProvider({
  children,
  session: initialContext,
  configs,
}) {
  const controlledContext = useContextController(initialContext, configs);

  return (
    <SessionContext.Provider value={controlledContext}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSessionContext = () => useContext(SessionContext);
