


export default function InputContainer({ children, className }) {
  return (
    <div className={"w-full focus-within:ring-4 transition-shadow duration-300 rounded-lg border-2 border-slate-500 outline-black " + (className ?? "")}>
      { children }
    </div>
  )
}