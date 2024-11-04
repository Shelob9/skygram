import { User } from ".";


export default function Aside({loggedInUser}:{
    loggedInUser: User
}) {
    return (
        <section className="hidden md:inline-grid md:col-span-1">
            <div className="fixed w-[380px]">
              <div className="flex items-center justify-between mt-14 ml-10">
                <img
                    src={loggedInUser.avatar}
                    alt={`${loggedInUser.username} avatar`}
                  className="h-16 rounded-full border p-[2px]"
                />
                <div className="flex-1 ml-4">
                  <h2 className="font-bold">{loggedInUser.username}</h2>
                  <h3 className="text-sm text-gray-400">Welcome</h3>
                </div>
                <button className="font-semibold text-blue-400 text-sm">
                  Sign out
                </button>
              </div>
            </div>
          </section>
    )
}
