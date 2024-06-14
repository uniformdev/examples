import { useUniformContext } from "@uniformdev/context-react";

export default function QurksSetter() {
  const { context } = useUniformContext();
  const onClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    await context.update({
      quirks: {
        city: "Montreal",
        loyaltyLevel: "Gold",
      },
    });
    window.location.reload();
  };
  return <button onClick={onClick}>Set Quirks</button>;
}
