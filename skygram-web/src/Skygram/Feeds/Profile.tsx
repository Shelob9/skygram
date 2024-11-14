import { AppBskyActorDefs } from "@atproto/api";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "../../ApiProvider/useApi";
import sanitizer from "../sanitizer";
import fetchProfile from "./fetchProfile";



const UserProfile = ({ profile }:{
    profile: AppBskyActorDefs.ProfileViewDetailed
}) => {
    return (
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-cover bg-center h-56 p-4" style={{ backgroundImage: `url(${profile.banner})` }}>
          <div className="flex justify-center">
            <img
              className="h-24 w-24 rounded-full border-4 border-white -mt-12"
              src={profile.avatar}
              alt={`${profile.displayName}'s avatar`}
            />
          </div>
        </div>
        <div className="p-4">
          <h1 className="text-center text-2xl font-bold">{profile.displayName || profile.handle}</h1>
          <p className="text-center text-gray-600">@{profile.handle}</p>
          {profile.description && <p
            className="mt-4 text-gray-700"
            dangerouslySetInnerHTML={{ __html: sanitizer(profile.description) }}
            />}

        </div>
      </div>
    );
  };
export default function Profile({actor}:{
    actor: string
}) {
    const {agent} = useApi()
    const {data,isFetching,isError} = useQuery({
        queryKey: ['getProfile', actor],
        queryFn: () => fetchProfile({actor, agent}),
    });
    if(isFetching) return <div>Loading...</div>
    if(isError) return <div>Error</div>
    if( !data ) return <div>No data</div>
    return <UserProfile profile={data} />
}
