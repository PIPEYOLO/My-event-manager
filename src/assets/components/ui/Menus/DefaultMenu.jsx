



export function DefaultMenuBox({ children }) {
  return (
    <div className="flex flex-col divide-y-2 border-2 rounded-lg overflow-hidden bg-1">
      { children }
    </div>
  )
}


export function DefaultMenuItem({ children }) {
  return (
    <div className="w-full h-10">
      { children }
    </div>
  )
}