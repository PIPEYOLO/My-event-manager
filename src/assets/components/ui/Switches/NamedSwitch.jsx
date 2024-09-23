import DefaultSwitch from "./DefaultSwitch";



export default function NamedSwitch({ name, isOn, switchState }) {
  return (
    <div className="h-fit w-fit flex gap-2 p-2 px-3 rounded-full bg-5">
      {
        name != undefined 
        ? (
          <span className="capitalize">{ name }</span>
        )
        : undefined
      }
      <DefaultSwitch isOn={ isOn } switchState={ switchState } />
    </div>
  )
}