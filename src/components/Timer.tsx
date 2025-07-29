import Container from "./UI/Container.tsx";
import {
  type Timer as TimerProps,
  useTimersContext,
} from "../store/timers-context.tsx";
import { useEffect, useRef, useState } from "react";

export default function Timer(props: TimerProps) {
  const timersContext = useTimersContext();
  const interval = useRef<number | null>(null);
  const [remainingTime, setRemainingTime] = useState(props.duration * 1000);
  const formatedTime = (remainingTime / 1000).toFixed(2);

  if (remainingTime <= 0 && interval.current) {
    clearInterval(interval.current);
  }

  useEffect(() => {
    let timer: number;
    if (timersContext.isRunning) {
      timer = window.setInterval(function () {
        setRemainingTime((prevTime) => {
          if (prevTime <= 0) {
            return prevTime;
          } else {
            return prevTime - 50;
          }
        });
      }, 50);
      interval.current = timer;
    } else if (interval.current) {
      clearInterval(interval.current);
    }

    return () => {
      clearInterval(timer);
    };
  }, [timersContext.isRunning]);

  return (
    <Container as="article">
      <h2>{props.name}</h2>
      <p>
        <progress max={props.duration * 1000} value={remainingTime} />
      </p>
      <p>{formatedTime}</p>
    </Container>
  );
}
