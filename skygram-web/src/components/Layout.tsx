import { ReactNode, useMemo } from "react";

function FixedTop({ children }: { children: ReactNode }) {
    return (
        <div className="fixed top-0 z-0 h-8 w-full bg-black text-white">
            {children}
        </div>

    )
}

function Inside({ children, hasTop }: { children: ReactNode,hasTop:boolean}) {
    return <div className={hasTop?"mt-12":undefined}>{children}</div>

}
const outterColumnClassName = `hidden md:block md:w-1/4 lg:w-1/4`
export default function Layout({
    children,
    Left,
    Right,
    CenterTop,
    LeftTop,
    RightTop,
}: {
    Left?: () => JSX.Element;
    Right?: () => JSX.Element;
    CenterTop: () => JSX.Element;
    LeftTop?: () => JSX.Element
    RightTop?: () => JSX.Element
    children: ReactNode }) {
        const hasLeftTop = useMemo( () => !!LeftTop, [LeftTop]);
        const hasRightTop = useMemo( () => !!RightTop, [RightTop]);
    return (
        <div className="min-hull h-full bg-black">
             <div className="flex h-full justify-center">
                <div className={`${outterColumnClassName} bg-black text-white`}>
                    <>
                        {LeftTop && <FixedTop><LeftTop /></FixedTop>}
                        <Inside hasTop={hasLeftTop}>
                            {Left ? <Left /> : null}
                        </Inside>
                    </>
                </div>

                <div className="w-full min-w-[600px] bg-white md:w-1/2 lg:w-1/2">
                    <FixedTop><CenterTop /></FixedTop>
                    {children}
                </div>

            <div className={`${outterColumnClassName} bg-blue text-black`}>
                <>
                    {RightTop && <FixedTop><RightTop /></FixedTop>}
                    <Inside hasTop={hasRightTop}>
                        {Right ?
                            <Right />
                         : null}
                    </Inside>
                </>

            </div>
        </div>
        </div>
    )
}
