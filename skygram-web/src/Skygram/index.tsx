import Feed from "./Feed";

export type User = {
  username: string;
  displayName: string;
  avatar: string;
  id: string;
}



export default function Skygram() {


  return (
    <section className="md:col-span-2">
      <Feed />
    </section>
  )
}
