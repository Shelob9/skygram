import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { ReactNode } from "react";

export default function Tabs({items,selectedIndex, setSelectedIndex}:{
    items: { key:string;children:ReactNode }[],
    selectedIndex:number, setSelectedIndex: (index:number) => void
}){

    return (
        <div className="flex h-screen w-full justify-center pt-24 px-4">
      <div className="w-full max-w-md">
        <TabGroup
            selectedIndex={selectedIndex} onChange={setSelectedIndex}
        >

          <TabPanels className="mt-3">
            {items.map(({ key,children}) => (
              <TabPanel key={key} className="rounded-xl bg-white/5 p-3">
                {children}
              </TabPanel>
            ))}
          </TabPanels>
          <TabList className="flex gap-4">
            {items.map(({ key }) => (
              <Tab
                key={key}
                className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
              >
                {key}
              </Tab>
            ))}
          </TabList>
        </TabGroup>
      </div>
    </div>
    )

}
