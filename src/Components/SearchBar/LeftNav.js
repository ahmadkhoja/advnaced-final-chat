import React from 'react'
import SearchBar from './SearchBar'

const LeftNav = ({ searchValue, onSearchChange }) => 
  <div>
    <SearchBar searchValue={searchValue} onSearchChange={onSearchChange}/>
  </div>

export default LeftNav