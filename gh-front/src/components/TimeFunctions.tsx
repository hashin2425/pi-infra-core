const formatDateTime = (date: Date): string => {
  return date
    .toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(/\//g, "-")
    .replace(",", "");
};

const getUTC = (): string => {
  const date = new Date();
  const utc = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  return formatDateTime(utc);
};

const getJTC = (): string => {
  const date = new Date();
  const jtc = new Date(date.getTime() + (date.getTimezoneOffset() + 9 * 60) * 60000);
  return formatDateTime(jtc);
};

export { getUTC, getJTC };