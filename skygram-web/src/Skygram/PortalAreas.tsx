import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function PortalAreas({Header,Aside}:{
    Header:React.ComponentType,
    Aside:React.ComponentType
}){
    const headerRef = useRef<HTMLDivElement>(null);
    const asideRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const headerElement = document.getElementById('skygram-header');
        if (headerElement) {
            headerRef.current = headerElement;
        }
        return () => {
            headerRef.current = null;
        }
    }, []);

    useEffect(() => {
        const asideElement = document.getElementById('skygram-main-aside');
        if (asideElement) {
            asideRef.current = asideElement;
        }
        return () => {
            asideRef.current = null;
        }
    }, []);
    return (
        <>
            {headerRef.current && createPortal(<Header />, headerRef.current)}
            {asideRef.current && createPortal(<Aside />, asideRef.current)}
        </>
    )
}
