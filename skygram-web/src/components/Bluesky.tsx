import { TbBrandBluesky } from "react-icons/tb";

export default function Bluesky({className,href}: {href?:string,className?: string}) {
    if(href){
        return <a href={href}
        rel="noreferrer"
        target="_blank"
        >
            <TbBrandBluesky
                className={className}
            />
        </a>
    }
    return <TbBrandBluesky
        className={className}
    />
}
