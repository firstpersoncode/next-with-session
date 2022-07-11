import { useEffect, useState } from "react";
import Link from "next/link";
import { useSessionContext } from "../session/lib/client";
import Bag from "./bag";

export default function Forest({}) {
  const { setEvent, getEvent, commit } = useSessionContext();

  const onPickBanana = () => {
    const foods = getEvent("foods");
    setEvent("foods", {
      event: { ...foods?.event, banana: foods?.event.banana + 1 || 1 },
      maxAge: 60 * 3,
    });
    commit();
    alert("+1 Banana");
  };

  const onPickDurian = () => {
    const foods = getEvent("foods");
    setEvent("foods", {
      event: { ...foods?.event, durian: foods?.event.durian + 1 || 1 },
      maxAge: 60 * 3,
    });
    commit();
    alert("+1 Durian");
  };

  return (
    <div className="forest">
      <section id="section-quit">
        <div className="center">
          <Link href="/#section-1">
            <button>Exit forest</button>
          </Link>
        </div>
      </section>
      <section id="section-0">
        <h1>Explore the forest</h1>
      </section>
      <section id="section-1">
        <div className="center fullHeight">
          <h1>Banana tree</h1>
          <p>Let&lsquo;s check if we can find some banana here..</p>
          <button onClick={onPickBanana}>Pick banana</button>
        </div>
      </section>
      <section id="section-2">
        <div className="center fullHeight">
          <h1>Durian tree</h1>
          <p>Let&lsquo;s check if we can find some durian here..</p>
          <button onClick={onPickDurian}>Pick durian</button>
        </div>
      </section>
      <section id="section-quit">
        <div className="center">
          <Link href="/#section-1">
            <button>Exit forest</button>
          </Link>
        </div>
      </section>
      <Bag />
    </div>
  );
}
