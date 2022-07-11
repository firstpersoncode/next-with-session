import { useEffect, useState } from "react";
import Link from "next/link";
import { useSessionContext } from "../session/lib/client";
import Bag from "./bag";

export default function Home({}) {
  const { setEvent, getEvent, commit } = useSessionContext();

  const onGetWater = () => {
    const water = getEvent("water");
    setEvent("water", {
      event: { ...water?.event, bottle: water?.event.bottle + 1 || 1 },
      maxAge: 60 * 60,
    });
    commit();
    alert("+1 Water");
  };

  const hasSeenXMark = getEvent("x");

  return (
    <div className="lake">
      <section id="section-quit">
        <div className="center">
          <Link href="/#section-1">
            <button>Exit lake</button>
          </Link>
        </div>
      </section>
      <section id="section-0">
        <h1>Explore the lake</h1>
      </section>
      <section id="section-1">
        <h1>Lake</h1>
        <p>Let&lsquo;s check if we can find some water here..</p>
        <div className="center">
          <button onClick={onGetWater}>Get water</button>
        </div>
      </section>
      {hasSeenXMark && (
        <section id="section-2">
          <h1>Abandoned house</h1>
          <p>Looks old and seems like the door isn&lsquo;t locked</p>
          <div className="center">
            <Link href="/house">
              <button>Enter</button>
            </Link>
          </div>
        </section>
      )}
      <section id="section-quit">
        <div className="center">
          <Link href="/#section-1">
            <button>Exit lake</button>
          </Link>
        </div>
      </section>
      <Bag />
    </div>
  );
}
