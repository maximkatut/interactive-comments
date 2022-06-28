import { formatDistanceToNowStrict } from "date-fns";

export const formatDate = (date: Date) => {
  return formatDistanceToNowStrict(date, { addSuffix: true });
};
