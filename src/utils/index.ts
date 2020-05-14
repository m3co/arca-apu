import { State } from 'arca-redux';
import { tree } from '../types/index';

const setItemToParent = (parentList: tree[], item: State['Source']['AAU-APU-in-App']['Rows'][0]) => {
  const itemKey = item.Key.split('.');

  if (parentList.length) {
    parentList.forEach(parent => {
      const parentKey = parent.Key.split('.');

      if (item.Key.includes(parent.Key) && parent.Expand) {
        if (itemKey.length - parentKey.length === 1) {
          parent.items.push({
            ...item,
            ...(item.Expand ? { items: [] } : {}),
          });
        } else {
          setItemToParent(parent.items, item);
        }
      }
    });
  } else {
    parentList.push({
      ...item,
      ...(item.Expand ? { items: [] } : {}),
    });
  }
};

export const parseToDotsFormat = (value: string) => `$${value.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')}`;

export const parseToNumber = (value: string) => Number(value.replace(/\D/g, ''));

export const debounce = (func: (params?: any) => void, delay: number, params?: any) => {
  let timeout: NodeJS.Timeout;

  const callFunc = () => {
    timeout = setTimeout(() => func(params), delay);
  };

  return () => {
    clearTimeout(timeout);

    callFunc();
  };
};

export const parseTreeItems = (items: State['Source']['AAU-APU-in-App']['Rows']): tree[] => items
  .reduce((filteredItems, item) => {
    const itemAlreadyExist = filteredItems.findIndex(filteredItem => filteredItem.Key === item.Key
      && filteredItem.Constraint === item.Constraint
      && filteredItem.Description === item.Description) === -1;

    if (itemAlreadyExist) {
      filteredItems.push(item);
    }

    return filteredItems;
  }, [] as State['Source']['AAU-APU-in-App']['Rows'])
  .sort((firstItem, secondItem) => {
    const firstKey = firstItem.Key.split('.');
    const secondKey = secondItem.Key.split('.');

    return firstKey.length - secondKey.length;
  })
  .reduce((list, item) => {
    setItemToParent(list, item);

    return list;
  }, [] as tree[]);
