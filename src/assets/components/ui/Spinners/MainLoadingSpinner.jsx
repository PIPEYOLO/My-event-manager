import { AiOutlineLoading } from "react-icons/ai";



export default function MainLoadingSpinner() {
  return (
    <div className="h-full aspect-square animate-spin duration-300">
      <AiOutlineLoading />
    </div>
  )
};