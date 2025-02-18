import { useEffect, useState } from 'react';

const useStoredState = <Data>(key: string, defaultValue: Data) => {
    const [data, setData] = useState<Data>(() => {
        let currentValue;

        try {
            currentValue = JSON.parse(
                localStorage.getItem(key) || String(defaultValue),
            );
        } catch (error:unknown) {
            console.log({error})
            currentValue = defaultValue;
        }

        return currentValue;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(data));
    }, [data, key]);

    const setDataKey = (itemKey: string, newValue: string) => {
        setData({ ...data, [itemKey]: newValue });
    };

    const getDataKey = (itemKey: string) => {
        if (!data[itemKey as keyof Data]) {
            return null;
        }
        return data[itemKey as keyof Data];
    };

    const deleteDataKey = (itemKey: string) => {
        const { [itemKey]: _, ...newData } = data;
        setData(newData as Data);
    };

    return { data, setData, setDataKey, getDataKey, deleteDataKey };
};

export default useStoredState;
