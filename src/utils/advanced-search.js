// Define regular expressions for special characters
const aREG = new RegExp('ș', 'g');
const bREG = new RegExp('ț', 'g');
const cREG = new RegExp('â', 'g');
const dREG = new RegExp('ă', 'g');

// Search-related functions
//******************************************************* */

function searchMunicipiu(query, locations) {
  let matchingLocations = [];

  const filtre = locations.nume
    .toLowerCase()
    .replace(aREG, 's')
    .includes(query);

  if (filtre) {
    const result = {
      query: locations.nume
    };
    matchingLocations.push(result);
  }

  for (const sector of locations.sector) {
    if (sector.nume.toLowerCase().includes(query)) {
      matchingLocations.push({
        query: sector.nume,
        parent: locations.nume
      });
    }
  }
  return matchingLocations.length > 0 ? matchingLocations : null;
}

function searchLocation(
  query,
  locations,
  parentJudetName = null,
  parentName = null
) {
  let matchingLocations = [];

  for (const location of locations) {
    const judetName = location.nume ? location.nume : parentJudetName;
    const filtre =
      location.nume
        .replace(aREG, 's')
        .replace(bREG, 't')
        .replace(cREG, 'a')
        .replace(dREG, 'a') &&
      location.nume
        .toLowerCase()
        .replace(aREG, 's')
        .replace(bREG, 't')
        .replace(cREG, 'a')
        .replace(dREG, 'a')
        .includes(query) &&
      judetName
        .toLowerCase()
        .replace(aREG, 's')
        .replace(bREG, 't')
        .replace(cREG, 'a')
        .replace(dREG, 'a')
        .includes(query);

    if (filtre) {
      const result = {
        query: location.nume,
        parent: parentJudetName,
        judet: parentName,
        tip: location.tip || null
      };
      matchingLocations.push(result);
      // Location found
    }

    // Recursively search in municipality, city, and commune levels
    if (location.municipiu) {
      const municipiuResult = searchLocation(
        query,
        location.municipiu,
        location.nume,
        judetName
      );
      if (municipiuResult != null) {
        matchingLocations.push(
          ...municipiuResult.filter((result) => result !== null)
        );
      }

      for (const municipiuLocation of location.municipiu) {
        const localitateResult = searchLocation(
          query,
          municipiuLocation.localitate,
          location.nume,
          judetName
        );
        if (localitateResult != null) {
          matchingLocations.push(
            ...localitateResult.filter((result) => result !== null)
          );
        }
        for (const nestedLocalitate of municipiuLocation.localitate) {
          const nestedLocalitateResults = searchLocation(
            query,
            [nestedLocalitate],
            municipiuLocation.nume,
            judetName
          );
          if (nestedLocalitateResults != null) {
            matchingLocations.push(
              ...nestedLocalitateResults.filter((result) => result !== null)
            );
          }
          if (nestedLocalitate.localitate != undefined) {
            for (const nestedLocalitate2 of nestedLocalitate.localitate) {
              const nestedLocalitateResults2 = searchLocation(
                query,
                [nestedLocalitate2],
                municipiuLocation.nume,
                judetName
              );
              if (nestedLocalitateResults2 != null) {
                matchingLocations.push(
                  ...nestedLocalitateResults2.filter(
                    (result) => result !== null
                  )
                );
              }
            }
          }
        }
      }
    }

    if (location.oras) {
      const orasResult = searchLocation(
        query,
        location.oras,
        location.nume,
        judetName
      );

      if (orasResult != null) {
        matchingLocations.push(
          ...orasResult.filter((result) => result !== null)
        );
      }

      for (const orasLocation of location.oras) {
        const localitateResult = searchLocation(
          query,
          orasLocation.localitate,
          location.nume,
          judetName
        );

        if (localitateResult != null) {
          matchingLocations.push(
            ...localitateResult.filter((result) => result !== null)
          );
        }

        for (const nestedLocalitate of orasLocation.localitate) {
          const nestedLocalitateResults = searchLocation(
            query,
            [nestedLocalitate],
            orasLocation.nume,
            judetName
          );
          if (nestedLocalitateResults != null) {
            matchingLocations.push(
              ...nestedLocalitateResults.filter((result) => result !== null)
            );
          }
          if (nestedLocalitate.localitate != undefined) {
            for (const nestedLocalitate2 of nestedLocalitate.localitate) {
              const nestedLocalitateResults2 = searchLocation(
                query,
                [nestedLocalitate2],
                orasLocation.nume,
                judetName
              );
              if (nestedLocalitateResults2 != null) {
                matchingLocations.push(
                  ...nestedLocalitateResults2.filter(
                    (result) => result !== null
                  )
                );
              }
            }
          }
        }
      }
    }
    if (location.comuna) {
      const comunaResult = searchLocation(
        query,
        location.comuna,
        location.nume,
        judetName
      );
      if (comunaResult != null) {
        matchingLocations.push(
          ...comunaResult.filter((result) => result !== null)
        );
      }

      for (const comunaLocation of location.comuna) {
        const localitateResult = searchLocation(
          query,
          comunaLocation.localitate,
          location.nume,
          judetName
        );

        if (localitateResult != null) {
          matchingLocations.push(
            ...localitateResult.filter((result) => result !== null)
          );
        }

        for (const nestedLocalitate of comunaLocation.localitate) {
          const nestedLocalitateResults = searchLocation(
            query,
            [nestedLocalitate],
            comunaLocation.nume,
            judetName
          );
          if (nestedLocalitateResults != null) {
            matchingLocations.push(
              ...nestedLocalitateResults.filter((result) => result !== null)
            );
          }
          if (nestedLocalitate.localitate != undefined) {
            for (const nestedLocalitate2 of nestedLocalitate.localitate) {
              const nestedLocalitateResults2 = searchLocation(
                query,
                [nestedLocalitate2],
                comunaLocation.nume,
                judetName
              );
              if (nestedLocalitateResults2 != null) {
                matchingLocations.push(
                  ...nestedLocalitateResults2.filter(
                    (result) => result !== null
                  )
                );
              }
            }
          }
        }
      }
    }
  }
  return matchingLocations.length > 0 ? matchingLocations : null;
}

// Function to remove duplicates based on judet, parent
function removeDuplicates(results) {
  const uniqueResults = [];
  const seenResults = new Set();

  if (results != null) {
    for (const result of results) {
      const key = `${result.judet}-${result.judet}-${result.parent}`;

      if (
        (result.judet !== result.parent && result.judet !== result.query) ||
        (result.judet === null && result.parent === null)
      ) {
        if (!seenResults.has(key)) {
          seenResults.add(key);
          uniqueResults.push(result);
        }
      }
    }
  }
  return uniqueResults;
}

module.exports = { removeDuplicates, searchLocation, searchMunicipiu };
