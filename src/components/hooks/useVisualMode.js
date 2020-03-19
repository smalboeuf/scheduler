import React, { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace) {
    setMode(newMode);
    if (replace) {
      const newHistory = history.slice(0, history.length - 1);
      setHistory([...newHistory, newMode]);
    } else {
      setHistory([...history, newMode]);
    }
  }

  function back() {
    if (!(mode === initial)) {
      if (Array.isArray(history)) {
        setMode(history[history.length - 2]);
        const newHistory = history.slice(0, history.length - 1);
        setHistory(newHistory);
      }
    }
  }

  return { mode, transition, back, history };
}
