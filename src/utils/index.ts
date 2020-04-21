export function parseToDotsFormat(value: string) {
  return `$${value.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')}`;
}

export function parseToNumber(value: string) {
  return Number(value.replace(/\D/g, ''));
}
