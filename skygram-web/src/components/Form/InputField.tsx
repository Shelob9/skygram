import { Description, Field, Input, Label } from '@headlessui/react'
import clsx from 'clsx'

export default function InputField({
    className,
    label,
    id,
    onChange,
    value,
    help
}:{
    className?:string,
    help?:string,
    id:string,
    label:string,
    onChange:(value:string) => void,
    value:string,
}) {
  return (
    <div className="w-full max-w-md px-4">
      <Field>
        <Label

            htmlFor={id}
            className="text-sm/6 font-medium text-white"
        >
          {label}
        </Label>

        <Input
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={clsx(
                'mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
                className
            )}
        />
        {help ? (
            <Description className="text-sm/6 text-white/50">
                {help}
            </Description>
        ) : null}
      </Field>
    </div>
  )
}
