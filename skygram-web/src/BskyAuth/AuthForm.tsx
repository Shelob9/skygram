
import { OAuthSignIn, OAuthSignInForm } from './oauth/OauthSignInForm';
const method = 'oauth';
export function AuthForm({
  oauthSignIn,
}: {
  oauthSignIn: OAuthSignIn
}) {

  // Tailwind css tabs
  return (
    <div className="p-4">
      <div className="flex my-4">
        <button
          className={`bg-blue-500 hover:bg-blue-700 font-bold py-1 px-4 rounded ${
            method === 'oauth' ? 'bg-blue-700' : ''
          }`}
          onClick={() => oauthSignIn }
          disabled={!oauthSignIn}
        >
          OAuth
        </button>


      </div>

      <OAuthSignInForm signIn={oauthSignIn} />
    </div>
  )
}
