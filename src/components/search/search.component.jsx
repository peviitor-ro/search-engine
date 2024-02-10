import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import './search.style.scss';
import magnifyGlass from '../../assets/svgs/magniy_glass_icon.svg';
import location from '../../assets/svgs/location_icon.svg';
import { getCountiesAndCities } from '../../utils/get-data';
import { locationSlice } from '../../state/location.slice';
import { updateQ, updateCounty, updatCity } from '../../state/query.slice';
import {
  searchLocation,
  searchMunicipiu,
  removeDuplicates
} from '../../utils/advanced-search';

export const Search = (props) => {
  // Props
  const handleClick = props.handleClick;

  // Redux
  const dispatch = useDispatch();
  const q = useSelector((state) => state.query.q);
  const city = useSelector((state) => state.query.city);
  const county = useSelector((state) => state.query.county);
  const locations = useSelector((state) => state.location);
  const selectedLocation = useSelector(
    (state) => state.location.selectedLocation
  );
  const oraseLoaded = useSelector((state) => state.location.loaded);
  const oraseError = useSelector((state) => state.location.error);

  // States
  const [uniqueResults, setUniqueResults] = React.useState([]);
  const [userLiMessage, setUserLiMessage] = React.useState(
    'Tastați minim 3 litere'
  );

  const [uniqueEstablished, setUniqueEstablished] = React.useState(false);

  React.useEffect(() => {
    getCountiesAndCities()
      .then((data) => {
        dispatch(locationSlice.actions.updateLocation(data));
        dispatch(locationSlice.actions.updateLoaded(true));
      })
      .catch(() => {
        dispatch(locationSlice.actions.updateError(true));
      });
  }, [dispatch]);

  /* we check if we havea query established, in which case we know we are in the results page
  and we only have to lock in the location because it's allready selected*/
  /* we verify using city and not selectedLocation, because we would have to
    add selectedLocation as a dependancy element, and when it changes it would
    lock in the first letter the user would type */
  React.useEffect(() => {
    if (city) setUniqueEstablished(true);
  }, [city]);

  // Functions
  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    handleClick();
  };

  // Handle clear X
  const handleClearX = (e) => {
    e.preventDefault();
    dispatch(updateQ(''));
  };

  //ADVANCED SEARCH FUNCTIONS
  //************************ */

  const removeAccents = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  const handleSelection = (selectedLocation) => {
    switch (true) {
      case !selectedLocation.judet && !selectedLocation.bucuresti:
        dispatch(updateCounty(removeAccents(selectedLocation?.query)));
        dispatch(updatCity(removeAccents(selectedLocation?.query)));
        dispatch(
          locationSlice.actions.updateSelectedLocation(
            `${selectedLocation.query.toLowerCase()}, ${selectedLocation.query.toLowerCase()}`
          )
        );
        break;
      case selectedLocation.bucuresti:
        dispatch(updateCounty(removeAccents(selectedLocation?.parent)));
        dispatch(updatCity(removeAccents(selectedLocation?.query)));
        dispatch(
          locationSlice.actions.updateSelectedLocation(
            `${selectedLocation.query.toLowerCase()}, ${selectedLocation.parent.toLowerCase()}`
          )
        );
        break;
      default:
        dispatch(updateCounty(removeAccents(selectedLocation?.parent)));
        dispatch(updatCity(removeAccents(selectedLocation?.query)));
        dispatch(
          locationSlice.actions.updateSelectedLocation(
            `${selectedLocation.query.toLowerCase()}, ${selectedLocation.judet.toLowerCase()} (${selectedLocation.parent.toLowerCase()})`
          )
        );
    }

    setUniqueResults([]);
    setShow(false);
  };

  const handleLiClick = (e) => {
    const { id } = e.target;
    const selectedLocation = uniqueResults.find((result) => result.id === id);
    setUniqueEstablished(true);
    handleSelection(selectedLocation);
  };

  const onChangeInput = (e) => {
    dispatch(locationSlice.actions.updateSelectedLocation(e.target.value));
    const { judet, municipiu } = locations.location;
    // Start the search after at least 3 letters
    if (e.target.value.length >= 3) {
      setShow(true);
      setUserLiMessage('Selectați locația');
      const searchResult = searchLocation(e.target.value.toLowerCase(), judet);
      const searchResultBucuresti = searchMunicipiu(
        e.target.value.toLowerCase(),
        municipiu
      );
      // Check if there are any matching results
      if (searchResult || searchResultBucuresti) {
        const uniqueResults = removeDuplicates(searchResult);
        if (searchResultBucuresti) {
          // Assign unique identifier for Bucharest
          searchResultBucuresti.forEach((result) => {
            result.bucuresti = true;
            if (!result.hasOwnProperty('parent')) {
              result.parent = 'BUCUREȘTI';
            }
          });
          uniqueResults.push(...searchResultBucuresti);
        }
        uniqueResults.forEach((result) => {
          result.id = uuidv4();
        });
        setUniqueResults(uniqueResults);
        //if there is only one result after the user input filtering, it will set it as the selected
        if (uniqueResults.length === 1 && !uniqueEstablished) {
          dispatch(
            locationSlice.actions.updateSelectedLocation(uniqueResults[0])
          );

          handleSelection(uniqueResults[0]);
          setUniqueEstablished(true);
        } else setUniqueEstablished(false);
      }
    } else {
      if (e.target.value.length === 1)
        setUserLiMessage('Mai tastați încă două litere');
      else setUserLiMessage('Mai tastați încă o literă');
    }
    // Clear results when the search input is empty
    if (e.target.value.length < 1) {
      dispatch(locationSlice.actions.updateSelectedLocation(''));
      setUniqueResults([]);
      setUniqueEstablished(false);
      setUserLiMessage('Tastați minim 3 litere');
    }
  };

  /*verifies that the user hasn't just typed random letters and clicked "Search",
  thus avoiding true location lock in via unique Result or click,so that in the results 
  page, the value in the input doesn't get to be the gibberish typing but a search for 
  the whole country in the case of a failed search */
  const verifyTrueLocationSelection = () => {
    if (!uniqueEstablished)
      dispatch(locationSlice.actions.updateSelectedLocation(''));
  };

  const ref = React.useRef(false);

  const [show, setShow] = React.useState(false);

  document.addEventListener('click', (e) => {
    try {
      if (
        e.target.childNodes[2] === ref.current ||
        e.target.parentNode.childNodes[2] === ref.current
      ) {
        setShow(true);
      } else {
        setShow(false);
      }
    } catch (e) {}
  });

  return (
    <form onSubmit={handleSubmit} className="search">
      <div className="inputs-wrapper">
        <div className="input-container">
          <img src={magnifyGlass} alt="magnify glass icon" />
          <input
            autoFocus
            placeholder="Ce doriți să lucrați?"
            // Update query search
            onChange={(e) => dispatch(updateQ(e.target.value))}
            value={q}
          />
          {q ? (
            <button className="clear" onClick={handleClearX}>
              <svg
                focusable="false"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
              </svg>
            </button>
          ) : null}
        </div>
        <div className="option-container ">
          <div className="county query">
            <img src={location} alt="location icon" />
            <input
              id="county"
              value={selectedLocation}
              className={uniqueEstablished ? 'locked-input' : ''}
              type="text"
              placeholder={
                oraseError
                  ? 'Eroare la încărcare'
                  : !selectedLocation
                  ? 'Tastați locația'
                  : ''
              }
              autoComplete="off"
              onChange={oraseLoaded ? onChangeInput : () => {}}
              readOnly={uniqueEstablished}
            />
            <ul
              name="county"
              ref={ref}
              className={show ? 'searchResults' : 'hide searchResults'}
              value={county.toLowerCase() ? county.toLowerCase() : ''}
            >
              <li data="">{userLiMessage}</li>
              {uniqueResults?.map((result, index) => {
                return (
                  <li key={index} id={result.id} onClick={handleLiClick}>
                    {result?.query.toLowerCase()},{' '}
                    {result.judet
                      ? result.judet.toLowerCase() +
                        ' (' +
                        result.parent.toLowerCase() +
                        ')'
                      : result.bucuresti
                      ? result.parent.toLowerCase()
                      : result.query.toLowerCase()}
                  </li>
                );
              })}
            </ul>

            <button
              className={uniqueEstablished ? 'clear' : 'hide clear'}
              type="button"
              onClick={() => {
                dispatch(updateCounty(''));
                dispatch(updatCity(''));
                dispatch(locationSlice.actions.updateSelectedLocation(''));
                setUniqueResults([]);
                setUserLiMessage('Tastați minim 3 litere');
                setUniqueEstablished(false);
              }}
            >
              <svg
                focusable="false"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="btn-yellow btn"
        onClick={verifyTrueLocationSelection}
      >
        Caută
      </button>
    </form>
  );
};
