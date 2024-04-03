import React, { useState } from 'react';
import './filter.style.scss';
import arrowBottom from '../../../../assets/svgs/arrow_bottom_black.svg';
import PropTypes from 'prop-types';
import magnifyIcon from '../../../../assets/svgs/magniy_glass_icon.svg';
import closeIcon from '../../../../assets/svgs/colse-icon.svg';

export const Filter = (props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [inputPayload, setInputPayload] = useState('');

  // Number of available cities - mocked value to simulate them in the UI:
  const cityNumber = 0;

  const onSetMenuShow = (event) => {
    event.stopPropagation();
    event.preventDefault();

    setMenuOpen((currentState) => !currentState);
  };

  const onDropdownClick = (event) => {
    event.stopPropagation();
  };

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputPayload(value);
  };

  const onResetInputPayload = () => {
    if (inputPayload.length > 0) {
      console.log('resetted');
      setInputPayload('');
    }
  };

  // nu se mai adauga butonul de Aplica cu text verde din josul listei de dropdown
  return (
    <div onClick={(e) => onSetMenuShow(e)} className="filter-container">
      <div className="filter-header">
        <h3 className="filter-title">
          {props.name}
          {props.name === 'Oras' && ` (${cityNumber})`}
        </h3>
        <img
          className={`arrow-bottom ${!menuOpen ? 'down' : 'up'}`}
          src={arrowBottom}
          alt="arrow"
        />
      </div>
      {menuOpen &&
        (props.filterType === 'input' ? (
          <div
            onClick={(e) => onDropdownClick(e)}
            className="dropdown-container"
          >
            <div className="search-input">
              <input
                onChange={(e) => onInputChange(e)}
                type="text"
                placeholder="search"
                value={inputPayload}
              />
              <img
                className="mangify"
                src={inputPayload.length > 0 ? closeIcon : magnifyIcon}
                onClick={onResetInputPayload}
                alt="magnify"
              />
            </div>
          </div>
        ) : (
          <div
            onClick={(e) => onDropdownClick(e)}
            className="dropdown-container"
          >
            {/* <select name="" id="">
              <option value="">Remote</option>
              <option value="">Hybrid</option>
              <option value="">On place</option>
            </select> */}

            <ul>
              <li>Remote</li>
              <li>Hybrid</li>
              <li>On place</li>
            </ul>
          </div>
        ))}
    </div>
  );
};

Filter.defaultProps = {
  name: 'default',
  filterType: 'input'
};

Filter.propTypes = {
  name: PropTypes.string,
  filterType: PropTypes.string
};
