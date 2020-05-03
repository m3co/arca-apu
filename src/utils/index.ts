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
