import { useSessionContext } from "../session";

export default function Bag() {
  const { getEvent } = useSessionContext();
  const foods = getEvent("foods");
  const water = getEvent("water");
  const other = getEvent("other");

  const onOpenBag = () => {
    alert(`
Banana: ${foods?.event.banana || 0}
Durian: ${foods?.event.durian || 0}
Water: ${water?.event.bottle || 0}
Shovel: ${other?.event.shovel || 0}
    `);
  };

  return (
    <button className="bag" onClick={onOpenBag}>
      Bag
    </button>
  );
}
