import React from 'react'
import './searchCSS.css'

const SearchBar = ({searchValue,onSearchChange,value}) => 
    <div className="searchBar">
      <input type="text" value={searchValue} onChange={onSearchChange} placeholder={value + '...'}/>
    </div>

export default SearchBar