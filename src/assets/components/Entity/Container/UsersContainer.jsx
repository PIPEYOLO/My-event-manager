import DefaultUserItem from "../../ui/Item/DefaultUserItem";



export default function UsersContainer({ users }) {  
  return (
    <div className="max-h-[300px] h-full flex flex-col divide-y-2 border-2 rounded-lg scrollbar-1 overflow-y-scroll">
      {
        users.map(user => <DefaultUserItem key={ user._id } _id={ user._id } />)
      }
    </div>
  )
}
