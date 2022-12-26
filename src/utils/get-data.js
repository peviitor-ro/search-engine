import { createQueryString } from "./create-query-string";
import { mapApiData } from "./map-api-data";

const API_VERSION = 'v3'

export const getData = (queryParams) => {
    return fetch(`https://api.peviitor.ro/${API_VERSION}/search/?${createQueryString(queryParams)}`)
        .then((response) => response.json())
        .then((data) => {
            return {
                jobs: mapApiData(data.response.docs),
                total: data.response.numFound
            };
        });
}

export const getTotalRomania = () => {
    return fetch(`https://api.peviitor.ro/${API_VERSION}/search/?country=România`)
        .then((response) => response.json())
        .then((data) => {
            return data.response.numFound;
        });
}