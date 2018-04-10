import React from 'react'
import './searchCSS.css'

const SearchBar = ({searchValue,onSearchChange}) => 
    <div className="searchBar">
      <input type="text" value={searchValue} onChange={onSearchChange} placeholder="Search.."/>
    </div>

export default SearchBar