import Aside from "./Aside";
import Feed from "./Feed";
import Header from "./Header";

export type User = {
  username: string;
  displayName: string;
  avatar: string;
  id: string;
}



export default function Skygram() {


  return (
      <>
        <Header />
        <main className="grid grid-cols-1 md:grid-cols-3 mx-auto md:max-w-6xl">
          <section className="md:col-span-2">
            <Feed />
          </section>
            <Aside/>
        </main>
      </>
  )
}
