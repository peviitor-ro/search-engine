import { createQueryString } from "./create-query-string";
import { mapApiData } from "./map-api-data";

export const getData = (queryParams) => {
    console.log(queryParams)
    return fetch(`https://api.peviitor.ro/v1/search/?${createQueryString(queryParams)}`)
        .then((response) => response.json())
        .then((data) => {
            return mapApiData(data.response.docs);
        });
}