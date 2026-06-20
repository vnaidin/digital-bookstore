import { useEffect, useState } from 'react';

interface OrderItem {
  itemId: number;
  price: number;
}

interface ResolvedItem {
  id: number;
  title: string;
  author?: string;
  image?: string;
  amount: number;
}

export function useOrderItems(items: OrderItem[]): ResolvedItem[] {
  const [resolved, setResolved] = useState<ResolvedItem[]>([]);

  useEffect(() => {
    if (!items?.length) return;
    const amountById = items.reduce<Record<number, number>>((acc, { itemId }) => {
      acc[itemId] = (acc[itemId] ?? 0) + 1;
      return acc;
    }, {});

    Promise.all(
      Object.entries(amountById).map(([id, amount]) =>
        fetch(`${import.meta.env.REACT_APP_BE_URL}/api/item/${id}`)
          .then((r) => r.json())
          .then((item) => ({ ...item, amount })),
      ),
    ).then(setResolved);
  }, [items]);

  return resolved;
}
