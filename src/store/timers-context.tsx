import { createContext, type ReactNode, useContext, useReducer } from "react";

export type Timer = {
  name: string;
  duration: number;
};

type TimersState = {
  isRunning: boolean;
  timers: Timer[];
};

const initialState: TimersState = {
  isRunning: true,
  timers: [],
};

type TimerContextValue = TimersState & {
  addTimer: (timerData: Timer) => void;
  startTimers: () => void;
  stopTimers: () => void;
};

const TimersContext = createContext<TimerContextValue | null>(null);

export function useTimersContext() {
  const timersContext = useContext(TimersContext);
  if (timersContext === null) {
    throw new Error("Can't be null");
  }

  return timersContext;
}

type TimersContextProviderProps = {
  children: ReactNode;
};

type ReducerAction =
  | { type: "ADD_TIMER"; payload: Timer }
  | { type: "START_TIMERS" }
  | { type: "STOP_TIMERS" };

function timerReducer(state: TimersState, action: ReducerAction): TimersState {
  if (action.type === "START_TIMERS") {
    // With ...state we copy the old object so we don't lose any of the previous state data that will not be changed.
    // If we don't do this, the state will be reset to the initial state.
    // You should never mutate the state directly, always return a new object.
    return { ...state, isRunning: true };
  } else if (action.type === "STOP_TIMERS") {
    return { ...state, isRunning: false };
  } else if (action.type === "ADD_TIMER") {
    // We can use the spread operator to add the new timer to the existing timers array.
    return {
      ...state,
      timers: [
        ...state.timers,
        { name: action.payload.name, duration: action.payload.duration },
      ],
    };
  }
  return state;
}

function TimerContextProvider(props: TimersContextProviderProps) {
  // Reducer should always be instantiated with an initial state and a reducer function.
  const [timersState, dispatch] = useReducer(timerReducer, initialState);
  const ctx: TimerContextValue = {
    isRunning: timersState.isRunning,
    timers: timersState.timers,
    addTimer: (timerData) => {
      dispatch({ type: "ADD_TIMER", payload: timerData });
    },
    startTimers: () => {
      dispatch({ type: "START_TIMERS" });
    },
    stopTimers: () => {
      dispatch({ type: "STOP_TIMERS" });
    },
  };

  return (
    <TimersContext.Provider value={ctx}>
      {props.children}
    </TimersContext.Provider>
  );
}

export { TimerContextProvider };
