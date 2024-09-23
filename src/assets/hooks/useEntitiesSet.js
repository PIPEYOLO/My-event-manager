import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { debounce } from "throttle-debounce";





export default function useEntitiesSet({ state, fetchMoreThunk, teardownThunk}) {

  const { firstLoadDone, options } = state;
  const dispatch = useDispatch();
  
  // Context Setup
  useEffect(() => {
    if(firstLoadDone === false) loadMore();
  }, [ firstLoadDone ]);

  // Context Teardown
  useEffect(() => {
    // When the component closes we make a teardown of the invitationsSTate to save memory
    return () => dispatch(teardownThunk());
  }, []);

  // Every time the options changes, do a debounced teardown, so in the next render some new content appears
  useEffect(() => {
    if(firstLoadDone === false) return; // with this we prevent doing the teardown we the component firstly loads
    debouncedTeardown();
  }, [ options ])

  const loadMore = useCallback(async () => {
    dispatch(fetchMoreThunk());
  }, []);


  const debouncedTeardown = useCallback(
    debounce(1000, () => {
      dispatch(teardownThunk());
    }
  ), []);


  return { loadMore };

}