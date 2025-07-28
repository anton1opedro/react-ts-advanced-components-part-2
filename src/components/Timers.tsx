import { useTimersContext } from "../store/timers-context.tsx";
import Timer from "./Timer.tsx";

export default function Timers() {
  const timersContext = useTimersContext();

  return (
    <ul>
      {timersContext.timers.map((timer) => (
        <li key={timer.name}>
          <Timer {...timer} />
        </li>
      ))}
    </ul>
  );
}
