import React, { useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './SideBar'

const Layout = ({children}:any) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="flex">
    <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    <div className={`flex-1 ${isSidebarOpen ? "ml-64" : "ml-0"} transition-all duration-300`}>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="p-4">{children}</div>
    </div>
  </div>
  )
}

export default Layout
