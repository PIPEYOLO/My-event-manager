import { memo, useRef } from "react";


const ThemeBackdrop = memo(
  function () {


    const image = useRef(<img className="absolute animateWithOpacity" src={`/public/image-${Math.floor(Math.random() * 5) + 1}.jpg`} />);


    return (
      <div className="relative h-full w-full">
        {image.current}
        <div className="absolute h-full w-full z-0 bg-black " style={{ opacity: .5}}></div>
      </div>
    )
  }
);


export default ThemeBackdrop;