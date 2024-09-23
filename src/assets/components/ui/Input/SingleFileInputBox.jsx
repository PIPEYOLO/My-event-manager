import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import DynamicPhoto from "../Photo/DynamicPhoto";

import { FaRegFileImage } from "react-icons/fa";
import { MdRemoveCircle } from "react-icons/md";




export default function SingleFileInputBox({ value, setValue, className, initialFileUrl }) {

  const fileInputRef = useRef(null);

  const [ fileUrlSrc, setFileUrlSrc ] = useState(initialFileUrl ?? null);


  const contentLoaded = useMemo(() => {
    if(fileUrlSrc !== null) {
      return <DynamicPhoto src={ fileUrlSrc } />;
    }
    else {
      return (
        <div className="flex flex-col justify-center items-center">
          <div className="h-1/3 aspect-square">
            <FaRegFileImage fill="#fff" />
          </div>
          <p>
            Select a file
          </p>
        </div>
      )
    }
  }, [ fileUrlSrc ]);

  useEffect(() => {
    if(value == null) {
      if(value === null) {
        setFileUrlSrc(null);
      }
      return;
    };
    value.arrayBuffer().then(result => {
      setFileUrlSrc(URL.createObjectURL(new Blob([ result ], { type: value.type })));
    })
  }, [ value ]);


  return (
    <div 
      onClick={ useCallback(() => fileInputRef.current.click(), []) }
      className={"relative h-full w-full flex items-center justify-center cursor-pointer " + (className ?? "")}
    >
      <input
        ref={ fileInputRef }
        className="hidden"
        type="file"
        multiple={ false }
        onChange={ useCallback((ev) => {
          const file = ev.target.files[0];
          setValue(file);
        }, [ setValue ] )}
      />
      
      <div className="absolute top-5 right-5 h-8 aspect-square" onClick={ useCallback((ev) => { 
          ev.stopPropagation(); 
          if(value !== null) setValue(null);
        }, [ value, setValue ])}>
        <MdRemoveCircle fill="#f00"/>
      </div>
      { contentLoaded }
    </div>
  )
}