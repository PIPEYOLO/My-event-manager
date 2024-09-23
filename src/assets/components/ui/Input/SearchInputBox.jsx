import { HiMagnifyingGlass } from "react-icons/hi2";
import DefaultInputBox from "./DefaultInputBox";
import InputContainer from "./InputContainer";


export default function SearchInputBox({ placeholder, value, onChange }) {

  return (
    <InputContainer className="h-fit min-w-[300px] grow flex rounded-full overflow-hidden focus-within:ring-2 ring-slate-400 bg-5">
      <div className="h-8 aspect-square order-first">
        <HiMagnifyingGlass />
      </div>
      <input
        placeholder={ placeholder ?? "Search..."}
        className="h-8 w-full p-3 bg-transparent"
        value={ value }
        onChange={ onChange }
      />
    </InputContainer>
  )
}