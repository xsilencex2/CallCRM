export function formatDate(date) {
  const d = new Date(date);
  const options = { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' };
  return d.toLocaleString('ru-RU', options).replace(',', '');
}
export function getResultDesc(result) {
  switch (result) {
    case 'buy': return "Купит";
    case 'no-buy': return "Не купит";
    case 'maybe': return "Сказал, что придет";
    default: return '';
  }
}
export function getResultIcon(result) {
  switch (result) {
    case 'buy': return '<i class="fas fa-check-circle"></i>';
    case 'no-buy': return '<i class="fas fa-times-circle"></i>';
    case 'maybe': return '<i class="fas fa-calendar-check"></i>';
    default: return '';
  }
}

