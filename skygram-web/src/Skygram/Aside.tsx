import { User } from ".";

//@ts-ignore
export default function Aside(props:{
    loggedInUser: User
}) {
    return (
        <section className="hidden md:inline-grid md:col-span-1">
            <div className="fixed w-[380px]">
              <div className="flex items-center justify-between mt-14 ml-10">

              </div>
            </div>
          </section>
    )
}
