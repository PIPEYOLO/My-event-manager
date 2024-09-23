import { useMemo } from "react";
import InfoBar from "../../ui/InfoBoxes/InfoBar";
import DefaultButton from "../../ui/Buttons/DefaultButton";



export default function EntitiesBaseSet({ error, entitiesCount, isOpenLoadMoreButton, loadMoreFn }) {
  const infoBarMessage = useMemo(() => {
    if(error == null) return "";
    if(error.status === 404) {
      if(entitiesCount > 0) return error.message.replace(/any/, "any more");
    }
    return error.message;
  }, [ error ]);

  return (
    <>
      {
        error != null ? <InfoBar message={infoBarMessage} type={error.status === 404 ? "info" : "error"} /> : ""
      }
      {
        isOpenLoadMoreButton === false
        ? (
          <DefaultButton
            className="border-2"
            onClick={loadMoreFn}>
              Load more
          </DefaultButton>
        )
        : ""
      }
    </>
  )
}