import { Field, Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import clsx from 'clsx';
import { Check as CheckIcon } from 'lucide-react';
import { useMemo } from 'react';

type Option = {
  value: string;
  label: string;
};

export default function SelectBox({
  options,
  selected,
  setSelected,
  className,
  id,
  label,
}: {
  options: Option[];
  selected: string;
  setSelected: (value: string) => void;
  className?: string;
  id: string;
  label: string;
}) {
  const selectedOption = useMemo(
    () => options.find((option) => option.value === selected),
    [options, selected]
  );

  return (
    <div className="w-full max-w-md px-4">
      <Field>
        <Label

            htmlFor={id}
            className="text-sm/6 font-medium text-black"
        >
          {label}
        </Label>
        <Listbox
          value={selected}
          onChange={setSelected}
          as="div"
          className={clsx(
            'text-black',
            'mt-3 block w-full rounded-lg border-2 bg-white/5 py-1.5 px-3 text-sm/6',
            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
            className
          )}
        >
          <ListboxButton className="text-sm/6 font-medium text-black">
            {selectedOption ? selectedOption.label : ' '}
          </ListboxButton>
          <ListboxOptions
            className={clsx(
              'mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm',
              className
            )}
          >
            {options.map(({ label, value }) => (
              <ListboxOption key={value} value={value} as={'div'}>
                {({ active, selected }) => (
                  <div
                    className={clsx(
                      'flex cursor-pointer select-none relative py-2 pl-10 pr-4',
                      active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'
                    )}
                  >
                    <span
                      className={clsx(
                        'block truncate',
                        selected ? 'font-medium' : 'font-normal'
                      )}
                    >
                      {label}
                    </span>
                    {selected ? (
                      <span
                        className={clsx(
                          'absolute inset-y-0 left-0 flex items-center pl-3',
                          active ? 'text-amber-600' : 'text-amber-600'
                        )}
                      >
                        <CheckIcon className="w-5 h-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </div>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
      </Field>
    </div>
  );
}
