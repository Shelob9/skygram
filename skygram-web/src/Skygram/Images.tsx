
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import Image from './Image';

const Images = ({images}:{
  images: {
    src: string;
    alt: string;
  }[];
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const hasPrevious = selectedIndex > 0
  const hasNext = selectedIndex < images.length - 1
  return (
    <TabGroup
      as="div"
      className="relative"
      selectedIndex={selectedIndex as number}
      onChange={() => setSelectedIndex}
    >
      <TabList
        as="div"
        className="sr-only absolute bottom-0 left-0 right-0 z-[2] mx-[15%] mb-4 flex list-none justify-center p-0"
      >
        {images.map((image, index) => (
          <Tab
            as="button"
            key={image.src}
            type="button"
            id={`button-${index}`}
            className="bg-blue mx-[3px] box-content h-[3px] w-[30px] flex-initial cursor-pointer border-0 border-y-[10px] border-solid border-transparent bg-white bg-clip-padding p-0 -indent-[999px] opacity-50 transition-opacity duration-[600ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] motion-reduce:transition-none"
            aria-current="true"
            aria-label={`Slide ${index}`} />
        ))}
      </TabList>
      <TabPanels
        as="div"
        className="relative w-full overflow-hidden after:clear-both after:block after:content-['']">
        {images.map((image, ) => (
          <TabPanel
            as="div"
            key={image.src}
            className="transition-translate-x-12 transition-opacity duration-300 ease-in-out relative float-left -mr-[100%] w-full "
            style={{
              backfaceVisibility: 'hidden'
            }}>
            <Image
              src={image.src}
              alt={image.alt} />
          </TabPanel>
        ))}

      </TabPanels>
      {hasPrevious ?(<button
        onClick={() => setSelectedIndex(selectedIndex - 1)}
        className="absolute bottom-0 left-0 top-0 z-[1] flex w-[15%] items-center justify-center border-0 bg-none p-0 text-center text-white opacity-50 transition-opacity duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] hover:text-white hover:no-underline hover:opacity-90 hover:outline-none focus:text-white focus:no-underline focus:opacity-90 focus:outline-none motion-reduce:transition-none"
        type="button"
      >
        <ChevronLeft
          className="inline-block h-12 w-12"
        />
        <span
          className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
        >
          Previous
        </span>
      </button>):null}
      {hasNext ? (
        <button
          onClick={() => setSelectedIndex(selectedIndex + 1)}
          className="absolute bottom-0 right-0 top-0 z-[1] flex w-[15%] items-center justify-center border-0 bg-none p-0 text-center text-white opacity-50 transition-opacity duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] hover:text-white hover:no-underline hover:opacity-90 hover:outline-none focus:text-white focus:no-underline focus:opacity-90 focus:outline-none motion-reduce:transition-none"
          type="button"
        >
          <ChevronRight
            className="inline-block h-12 w-12"
          />
          <span
            className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
          >
            Next
          </span>
        </button>
      ) : null}
    </TabGroup>
  )
}
export default Images;
