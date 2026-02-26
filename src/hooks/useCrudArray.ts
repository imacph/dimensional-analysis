import { useState } from "react";
import type { IdType } from "../lib/model/types";

export function useCrudArray<T extends { id: IdType }>(initial: T[] = []) {
    const [items, setItems] = useState<T[]>(initial);

    const add = (item: Omit<T, "id">) => {
        setItems([...items, { ...item, id: Date.now() } as T]);
    };

    const edit = (id: IdType, field: keyof T, value: any) => {
        setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
    };

    const remove = (id: IdType) => {
        setItems(items.filter(i => i.id !== id));
    };

    return { items, add, edit, remove, setItems };
}