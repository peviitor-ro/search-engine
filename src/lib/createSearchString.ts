export function createSearchString(
  q?: string[] | string,
  city?: string | string[],
  county?: string | string[],
  country?: string,
  company?: string | string[],
  remote?: string | string[],
  page?: string
): string {
  const queryParams: string[] = [];

  // Function to handle conversion of parameter to query string format
  const processParam = (paramName: string, value?: string | string[]) => {
    if (value != null) {
      if (Array.isArray(value)) {
        const filteredValues = value.filter((v) => v.trim() !== "");
        if (filteredValues.length > 0) {
          queryParams.push(
            `${paramName}=${filteredValues.map(encodeURIComponent).join("+")}`
          );
        }
      } else if (typeof value === "string" && value.trim() !== "") {
        queryParams.push(`${paramName}=${encodeURIComponent(value)}`);
      }
    }
  };

  // Check and include 'q' if provided and not empty
  processParam("q", q);

  // Check and include 'city' if not empty
  processParam("city", city);

  // Check and include 'county' if not empty
  processParam("county", county);

  // Check and include 'company' if not empty
  processParam("company", company);

  // Include 'country'
  if (country != null && country.trim() !== "") {
    queryParams.push(`country=${encodeURIComponent(country)}`);
  }

  // Check and include 'remote' if not empty
  processParam("remote", remote);

  // Always include 'page'
  if (page != null) {
    queryParams.push(`page=${page}`);
  }

  return queryParams.join("&");
}
