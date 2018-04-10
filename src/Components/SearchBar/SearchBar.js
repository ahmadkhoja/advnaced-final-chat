import React from 'react'

const SearchBar = ({searchValue,onSearchChange}) => 
    <div>
      <input value={searchValue} onChange={onSearchChange} />
    </div>

export default SearchBar