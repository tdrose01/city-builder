import { useRef, useMemo } from 'react';
import { shallow } from 'zustand/vanilla/shallow';

/**
 * A stable selector hook that prevents infinite loops when selecting
 * derived data from Zustand stores.
 * 
 * Usage:
 *   const activeEvents = useStableSelector(useEventStore, state => state.getActiveEvents());
 */
export function useStableSelector(store, selector) {
  const prevRef = useRef(undefined);
  const selectorRef = useRef(selector);
  
  // Keep selector ref up to date
  selectorRef.current = selector;
  
  // Get the current value
  const value = store(selectorRef.current);
  
  // Use shallow comparison to return stable reference
  if (shallow(prevRef.current, value)) {
    return prevRef.current;
  }
  
  prevRef.current = value;
  return value;
}

/**
 * Select raw data from store and derive with memoization.
 * 
 * Usage:
 *   const activeEvents = useDerivedSelector(
 *     useEventStore,
 *     state => state.calendar.events,
 *     (events) => Object.values(events).filter(e => e.lifecycle === 'active')
 *   );
 */
export function useDerivedSelector(store, rawSelector, deriveFn) {
  const rawValue = store(rawSelector);
  return useMemo(() => deriveFn(rawValue), [rawValue, deriveFn]);
}
