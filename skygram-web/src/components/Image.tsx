
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import Tabs from "./Tabs";

const images: { src: string; alt: string }[] = [
    {
        src: 'https://placehold.co/600x400',
        alt: 'Example',
    },
    {
        src: 'https://picsum.photos/200/300',
        alt: 'Example',
    },
    {
        src: 'https://placehold.co/1200x800',
        alt: 'Example',
    },
    {
        src: 'https://picsum.photos/300/100',
        alt: 'Example',
    },
];
const Images = ({images}:{
    images: { src:string, alt:string }[]
}) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    const onPrev = () => {
        if(selectedIndex === 0){
            //set to last image
            return setSelectedIndex(images.length - 1)
        }else {
            setSelectedIndex(selectedIndex - 1)
        }
    }
    const onNext = () => {
        if(selectedIndex === images.length - 1){
            //set to first image
            return setSelectedIndex(0)
        }else {
            setSelectedIndex(selectedIndex + 1)
        }
    }
    return (
        <div className="flex">

            <div className="flex flex-col w-1/3">
                Left
            </div>
            <div className="flex flex-col w-2/3">
                <Tabs  items={images.map((image) => ({
                    key: image.src,
                    children: (
                        <div className="flex flex-col items-center">
                            <img src={image.src} alt={image.alt} />
                            <div className="flex gap-4">
                                <button onClick={onPrev}>
                                    <ChevronLeft />
                                </button>
                                <button onClick={onNext}>
                                    <ChevronRight />
                                </button>
                            </div>
                        </div>
                    ),
                }))} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />

            </div>
        </div>
    );
};
