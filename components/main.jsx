import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSessionContext } from "../session/lib/client";
import Bag from "./bag";

export default function Main({}) {
  const { setEvent, getEvent, commit } = useSessionContext();
  const other = getEvent("other");

  const onContinueSection = useCallback(() => {
    if (typeof window === "undefined") return;
    const sectionOne = document.getElementById("section-1");
    const isBottom =
      sectionOne.getBoundingClientRect().bottom <= window.innerHeight;
    const foods = getEvent("foods");
    const water = getEvent("water");

    if (
      isBottom &&
      !other?.event.treasure &&
      !(
        (foods?.event.banana > 0 || foods?.event.durian > 0) &&
        water?.event.bottle > 0
      )
    ) {
      alert(
        "Collect foods and water before continuing your journey, you can find foods in the forest and water in the lake"
      );
      sectionOne.scrollIntoView(true);
    }
  }, [other, getEvent]);

  const onReachTreasure = useCallback(() => {
    if (typeof window === "undefined") return;
    const sectionTreasure = document.getElementById("section-treasure");
    const isBottom =
      sectionTreasure.getBoundingClientRect().bottom <=
      window.innerHeight + 300;
    const hasSeenXMark = getEvent("x");

    if (isBottom && !hasSeenXMark) {
      setEvent("x", { event: "Has seen the X mark", maxAge: 60 * 60 });
      commit();
    }
  }, [getEvent, setEvent, commit]);

  useEffect(() => {
    document.addEventListener("scroll", onContinueSection);
    document.addEventListener("scroll", onReachTreasure);

    return () => {
      document.removeEventListener("scroll", onContinueSection);
      document.removeEventListener("scroll", onReachTreasure);
    };
  }, [onContinueSection, onReachTreasure]);

  const onDig = () => {
    const hasShovel = other?.event.shovel;
    if (!hasShovel) alert("You need a shovel to start digging");
    else {
      const totalDig = other?.event.dig || 0;

      if (totalDig < 10) {
        setEvent("other", {
          event: { ...other?.event, dig: other?.event.dig + 1 || 1 },
          maxAge: 60 * 60,
        });
      } else {
        setEvent("other", {
          event: { ...other?.event, treasure: true },
          maxAge: 60 * 60,
        });
      }

      commit();
    }
  };

  return (
    <div className="home">
      <section id="section-0">
        <h1>Find the golden treasure</h1>
        <p>
          We need to find the golden treasure. scroll until you see the X mark.
        </p>
      </section>
      <section id="section-1">
        <div className="center fullHeight">
          <div>
            <Link href="/forest">
              <button>Forest</button>
            </Link>
            <Link href="/lake">
              <button>Lake</button>
            </Link>
          </div>
        </div>
      </section>
      <section id="section-2">
        <div className="center fullHeight">Almost there</div>
      </section>
      <section id="section-treasure">
        {!other?.event.treasure && (
          <p>Can you see that X mark? let&lsquo;s start digging ...</p>
        )}
        <div className="center">
          {!other?.event.treasure ? (
            <button onClick={onDig}>X</button>
          ) : (
            <iframe
              width="420"
              height="315"
              src="https://www.youtube.com/embed/TX6VB96SxyM?autoplay=1"
            ></iframe>
          )}
        </div>
      </section>
      {!other?.event.treasure && (
        <p>Hint: We might miss something in the Lake ...</p>
      )}
      <Bag />
    </div>
  );
}
