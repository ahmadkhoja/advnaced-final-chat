import React from 'react'
import SearchBar from './SearchBar'

const LeftNav = ({ searchValue, onSearchChange }) => 
  <div style={{padding:'10px', float:'left',height:'100%', background:'#ccc'}}>
    <SearchBar searchValue={searchValue} onSearchChange={onSearchChange}/>
  </div>

export default LeftNav