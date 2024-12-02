import { Field, Input } from "@headlessui/react"
import clsx from "clsx"

export default function Submit({value,className}:{
    value:string,
    className?:string
}) {

    return (
        <div className="w-full max-w-md px-4">
            <Field>
                <Input
                    className={clsx(
                        "text-black",
                        'mt-3 block w-full rounded-lg border-2 bg-white/5 py-1.5 px-3 text-sm/6 ',
                        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
                        "hover:bg-black hover:text-white hover:border-black/50",
                        "w-full",
                        className
                    )}
                        type="submit"
                        value={value}
                />
            </Field>
        </div>
    )
}
