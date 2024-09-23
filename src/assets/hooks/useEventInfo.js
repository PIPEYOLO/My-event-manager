import { useMemo } from "react";



export default function useEventInfo(eventInfo) {
  const { startDate } = eventInfo;

  const date = useMemo(()=> new Date(startDate), [ startDate ]);
  const now = useMemo(()=> new Date());
  
  const dateRepresentation = useMemo(()=> {
    return date.toString().split(" ").slice(0, 4).join(" ");
  }, [ startDate ]);

  return { now, date, dateRepresentation };
}