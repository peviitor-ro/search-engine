import { createQueryString } from "./create-query-string";
import { mapApiData } from "./map-api-data";

export const getData = (queryParams) => {
    return fetch(`https://api.peviitor.ro/v1/search/?${createQueryString(queryParams)}`)
        .then((response) => response.json())
        .then((data) => {
            return {
                jobs: mapApiData(data.response.docs),
                total: data.response.numFound
            };
        });
}

export const getTotalRomania = () => {
    return fetch(`https://api.peviitor.ro/v1/search/?country=România`)
        .then((response) => response.json())
        .then((data) => {
            return data.response.numFound;
        });
}