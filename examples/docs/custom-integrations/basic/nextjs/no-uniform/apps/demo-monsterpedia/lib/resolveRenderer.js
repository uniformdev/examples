import MonsterDetails from "../components/MonsterDetails";

export default function resolveRenderer({ type }) {
  if (type == "dragonDetails") {
    return MonsterDetails;
  }
  return UnknownComponent;
}

function UnknownComponent({ component }) {
  return <div>[unknown component: {component.type}]</div>;
}
