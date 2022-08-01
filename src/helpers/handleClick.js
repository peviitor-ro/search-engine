import { createQueryString } from "./createQueryString";

export const handleClick = (queries, navigate) => {
  const search = createQueryString(queries);
  localStorage.setItem('isInternal', 'true');
  navigate({ pathname: "/rezultate", search });
}