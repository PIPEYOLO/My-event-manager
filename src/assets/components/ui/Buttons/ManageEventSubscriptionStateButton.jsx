import DefaultButton from "./DefaultButton";


export default function ManageSubscriptionStateButton({ subscribed, changeState }) {
  return (
    <DefaultButton
      className="capitalize p-2 border rounded-full" 
      onClick={ changeState }
    >
      { subscribed ? "unsubscribe" :"subscribe" }
    </DefaultButton>
  )
}