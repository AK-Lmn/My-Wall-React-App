import { UserRound } from "lucide-react";

const colors = ["#b5c9d2", "#c8baa8", "#a8bcb5", "#b6b2c8", "#c5ad9c"];
export default function Avatar({
  name,
  large = false,
}: {
  name: string;
  large?: boolean;
}) {
  const color =
    colors[
      Array.from(name).reduce((sum, c) => sum + c.charCodeAt(0), 0) %
        colors.length
    ];
  return (
    <div
      aria-label={`${name}'s profile picture`}
      role="img"
      className={`avatar ${large ? "avatar-large" : ""}`}
      style={{ backgroundColor: color }}
    >
      <UserRound aria-hidden="true" strokeWidth={1.2} />
    </div>
  );
}
