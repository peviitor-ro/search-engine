import { createQueryString } from "./createQueryString";

export const handleClick = (queries, navigate) => {
  const search = createQueryString(queries);
  navigate({ pathname: "/rezultate", search });
}