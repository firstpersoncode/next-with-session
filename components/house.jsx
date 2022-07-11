import { useEffect, useState } from "react";
import Link from "next/link";
import { useSessionContext } from "../session/lib/client";
import Bag from "./bag";

export default function Home({}) {
  const { setEvent, getEvent, commit } = useSessionContext();

  const onCheckBedroom = () => {
    alert("The owner used to sleep here..");
  };
  const onCheckBackyard = () => {
    const other = getEvent("other");
    if (!other?.event.shovel) {
      setEvent("other", {
        event: { shovel: 1 },
        maxAge: 60 * 60,
      });
      commit();
      alert("+1 Shovel");
    } else alert("The owner used to farm here..");
  };

  return (
    <div className="house">
      <section id="section-quit">
        <div className="center">
          <Link href="/lake/#section-2">
            <button>Exit abandoned house</button>
          </Link>
        </div>
      </section>
      <section id="section-0">
        <h1>Abandoned house</h1>
        <p>Let&lsquo;s check around..</p>
      </section>
      <section id="section-1">
        <h1>Bedroom</h1>
        <div className="center">
          <button onClick={onCheckBedroom}>Check</button>
        </div>
      </section>
      <section id="section-2">
        <h1>Backyard</h1>
        <div className="center">
          <button onClick={onCheckBackyard}>Check</button>
        </div>
      </section>
      <section id="section-quit">
        <div className="center">
          <Link href="/lake/#section-2">
            <button>Exit abandoned house</button>
          </Link>
        </div>
      </section>
      <Bag />
    </div>
  );
}
