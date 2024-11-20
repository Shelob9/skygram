import { ReactNode, useEffect, useState } from "react";

const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
  };

//Render if we have a cookie set for this flagged feature
export default function IfFlag({cookie,children}:{cookie:string,children:ReactNode}) {

    const [flag,setFlag] = useState<boolean>(false)
    useEffect(() => {
        const value = getCookie(cookie)
        if(value){
            setFlag(value === 'true')
        }
    },[cookie])
    return flag ? <>{children}</> : null

}
