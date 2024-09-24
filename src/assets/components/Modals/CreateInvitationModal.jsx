import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DefaultButton from "../ui/Buttons/DefaultButton";
import DefaultInputBox from "../ui/Input/DefaultInputBox";
import InfoBar from "../ui/InfoBoxes/InfoBar";
import SearchInputBox from "../ui/Input/SearchInputBox";
import UsersContainer from "../Entity/Container/UsersContainer";
import DefaultUserItem from "../ui/Item/DefaultUserItem";
import RemoveCrossButton from "../ui/Buttons/RemoveCrossButton";
import CreatePlusButton from "../ui/Buttons/CreatePlusButton";
import { debounce } from "throttle-debounce";
import { getUsers } from "../../../../utils/fetch/user";
import EntitiesBaseSet from "../Entity/Sets/EntitiesBaseSet";
import { createInvitation } from "../../../../utils/fetch/invitation";
import { useNavigate } from "react-router-dom";




export default function CreateInvitationModal({ event_id, setIsOpen }) {

  const [ description, setDescription ] = useState("");
  const [ invitedUsers, setInvitedUsers ] = useState([]);
  const [ error, setError ] = useState(null);

  const addInvitedUser = useCallback((user) => setInvitedUsers([ ...invitedUsers, user ]), [ invitedUsers ]);
  const removeInvitedUser = useCallback((_id) => setInvitedUsers(invitedUsers.filter(user => user._id !== _id)), [ invitedUsers ]);

  const navigate = useNavigate();

  const createInvitation__onClick = useCallback(async () => {
    const invitedUsers_ids = invitedUsers.map(user => user._id);
    const response = await createInvitation({ event_id, description, invitedUsers_ids });
    const { success, data, error } = response.data;
    if(success === false) return setError(error); // if there s a problem set it in the state
    return navigate(`/invitation/${data._id}`); // otherwise redirect to the created invitation page
  }, [ description, invitedUsers ]);

  return (
    <div className="relative flex flex-col gap-6 p-5 rounded-lg border-2 bg-1 z-[1000005]">
      <h2>Create Invitation</h2>

      <DefaultInputBox 
        value={ description }
        onChange={ useCallback((ev) => setDescription(ev.target.value), []) }
        placeholder="Write a description..." 
        labelText="Description"
      />

      <div className="flex flex-wrap lg:flex-nowrap items-center justify-center gap-10">
        <div>
          <h4>Users to invite:</h4>
          <div className="max-w-full h-[300px] w-[350px] flex flex-col divide-y-2 border-2 rounded-lg scrollbar-1 overflow-y-scroll">
            {
              invitedUsers.map(user => 
                <DefaultUserItem 
                  key={ user._id }
                  _id={ user._id } 
                  user={ user } 
                  extraSiblings={ <div className="grow flex justify-end items-center"> <RemoveCrossButton className="order-last" onClick={ () => removeInvitedUser(user._id) } /> </div> } 
                />
              )
            }
          </div>
        </div>
        <UsersToInviteSearchSet invitedUsers={ invitedUsers } add={ addInvitedUser } />
      </div>

      <br />

      
      {
        error !== null ? <InfoBar message={ error.message} type="error" /> : undefined
      }


      <div className="flex justify-center gap-5 mt-10">
        <DefaultButton className="p-x-4 p-y-2 font-bold hover:scale-110 bg-6" onClick={ createInvitation__onClick }>
          Create
        </DefaultButton>
        <DefaultButton className="p-x-4 p-y-2 border rounded-full" onClick={ useCallback(() => setIsOpen(false), []) }>
          Close
        </DefaultButton>
      </div>

    </div>
  )
}



function UsersToInviteSearchSet({ invitedUsers, add }) {
  
  const [ search, setSearch ] = useState("");
  const [ usersFound, setUsersFound ] = useState([]);
  const [ error, setError ] = useState(null);

  const invitedUsersMap = useMemo(() => Object.fromEntries(invitedUsers.map(user => [ user._id, true ])), [ invitedUsers ]);

  const loadMore = useCallback(async () => {
    const response = await getUsers({ search, skip: usersFound.length });
    const { success, data, error } = response.data;
    if(success === false) return setError(error);
    return setUsersFound([ ...usersFound, ...data ]);
  }, [ search, usersFound ]);

  const debouncedLoadMore = useCallback(
    debounce(1000, () => {
      loadMore();
    })
  , [ loadMore ]);

  // Whenever search changes set users to [] and error to null and do a debounced load of users
  useEffect(() => {
    setError(null);
    setUsersFound([]);
    if(search.length === 0) return; // avoid fetching users with an empty seach
    debouncedLoadMore();
  }, [ search ])


  return (
    <div className="flex flex-col gap-3">
      <SearchInputBox placeholder="Search a user to invite" value={ search } onChange={ useCallback((ev) => setSearch(ev.target.value), []) } />
      <div className="max-w-full h-[300px] w-[350px]  flex flex-col divide-y-2 border-2 rounded-lg scrollbar-1 overflow-y-scroll">
        {
          usersFound.map(user => 
            <DefaultUserItem 
              key={ user._id }
              _id={ user._id } 
              user={ user }
              extraSiblings={
                invitedUsersMap[user._id] === undefined 
                ? <div className="grow flex justify-end items-center"> <CreatePlusButton className="order-last" onClick={ () => add(user)} /> </div> // insert an add button if user was not included
                : <div className="h-fit p-2 ml-auto rounded-full bg-green-400">Added</div> // insert and "added" tag if user has already been added (prevent from adding multiple times)
              } 
            />
          )
        }
      </div>

      <EntitiesBaseSet
        error={ error } 
        entitiesCount={ usersFound.length }
        isOpenLoadMoreButton={ ( usersFound.length === 0 || error != null) }
        loadMoreFn={ loadMore } 
      />
    </div>
  )
}
