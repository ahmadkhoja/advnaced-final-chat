import React from 'react'
import SearchBar from './SearchBar'

const LeftNav = ({ searchValue, onSearchChange, value }) => 
  <div style={{display:'inline-block',}} >
    <SearchBar searchValue={searchValue} onSearchChange={onSearchChange} value={value}/>
  </div>

export default LeftNav