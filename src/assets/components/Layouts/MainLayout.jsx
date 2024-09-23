import { useCallback, useEffect, useRef, useState } from "react";
import AsideLeftSection from "../Sections/AsideLeftSection";
import MainNavBar from "../Sections/MainNavBar";
import { useMediaQuery } from 'react-responsive';

export default function MainLayout({ children }) {
  const mq = useMediaQuery({ query: "(min-width: 768px)"});
  const [ openAside, setOpenAside ] = useState(false);
  const firstLoadRef = useRef(false);

  useEffect(() => {
    firstLoadRef.current = true;
  }, [])


  return (
    <main>
      <div className="flex flex-col h-full">
        <MainNavBar 
          aside={ { open: openAside, toggle: useCallback(() => setOpenAside(!openAside), [ openAside ]) } }
          showAsideButtonIsOpen={ mq === false } 
        />

        <div className="flex h-full">
          {
            mq ? (
              <div className="h-full border-r-2 z-[10000]">  
                <AsideLeftSection />
              </div>
            )
            : (
              <div 
                className={
                  "absolute h-full border-r-2 -translate-x-full z-[10000] " + 
                  ( openAside ? "-translate-x-0 " : "") +
                  (firstLoadRef.current ? "transition-transform" : "") // we use this transition only after the first load occurs because when the fist load occurs the aside is initialy visible and the displaces out of the screen with the transition
                }
              > 
                <AsideLeftSection />
              </div>
            )
          }

        
          { children }
        </div>
      </div>
    </main>
  )
}