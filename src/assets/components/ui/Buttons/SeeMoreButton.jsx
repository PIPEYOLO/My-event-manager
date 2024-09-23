import { useCallback } from "react";
import DefaultButton from "./DefaultButton";
import { useNavigate } from "react-router-dom";



export default function SeeMoreButton({ url }) {
  const navigate = useNavigate();
  return (
    <DefaultButton className="p-2 border rounded-full" onClick={useCallback(()=> navigate(url), [ url ])}>See More</DefaultButton>
  )
}