import { useAuthContext } from "./useAuthContext";

export default function SignOut(){
    const { signOut } = useAuthContext();
    return (
        <div>
            <button onClick={signOut}>Sign-out</button>
        </div>
    )
}
