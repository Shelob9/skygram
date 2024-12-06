import AsideSection from "./AsideSection";

//   <aside tag is in template

export default function Aside({children,title}: {title:string,children: React.ReactNode}) {
    return (
        <>
            <div className="fixed w-[380px] ">
                <AsideSection title={title}>
                    {children}
                </AsideSection>
            </div>

        </>
    );
}
