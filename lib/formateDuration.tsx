export const toDate = (val: string | Date): Date =>
  val instanceof Date ? val : new Date(val);

export const formatDuration = (
  from: string | Date,
  to: "present" | string | Date
) => {
  const start = toDate(from);
  const end = to === "present" ? new Date() : toDate(to as string | Date);
  let months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  if (months < 0) months = 0;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (years === 0 && rem === 0) return "<1 mo";
  if (years === 0) return `${rem} month${rem > 1 ? "s" : ""}`;
  if (rem === 0) return `${years} yr${years > 1 ? "s" : ""}`;
  return `${years} yr${years > 1 ? "s" : ""} ${rem} month${rem > 1 ? "s" : ""}`;
};

export const formatMonthYear = (val: string | Date): string =>
  toDate(val).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
  });
