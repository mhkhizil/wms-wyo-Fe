import React from 'react'
import Navbar from './Navbar'

const Layout = ({children}:any) => {
  return (
    <div className=''>
      <Navbar/>
    {children}
  
    </div>
  )
}

export default Layout
