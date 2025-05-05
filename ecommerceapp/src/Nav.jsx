import { useState, useEffect } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { Menu } from 'antd'
import { HomeOutlined, UserOutlined, ProfileOutlined, AuditOutlined } from '@ant-design/icons'
import { Hub } from 'aws-amplify/utils'
import checkUser from './checkUser'

/**
 * Function to create the navigation
 * 
 * @param {*} isAdmin 
 * @returns 
 */
const getNavLinks = (isAdmin) => {
    const navLinks = [
        {
            key: 'Home',
            label: (
                <Link to="/">
                    <HomeOutlined/>
                    Home
                </Link>
            )
        },
        {
            key: 'profile',
            label: (
                <Link to="/profile">
                    <ProfileOutlined/>
                    Profile
                </Link>
            )
        },
        {
            key: 'final',
            label: (
                <Link to="/final">
                    <AuditOutlined />
                    Final
                </Link>
            )
        }
    ]

    // If the user is an admin, add the admin item!
    if (isAdmin) {
        navLinks.push(
            {
                key: 'admin',
                label: (
                    <Link to="/admin">
                        <UserOutlined/>
                        Admin
                    </Link>
                )
            }
        )
    }
    return navLinks
}


const Nav = () => {
    const [selectedPage, setSelectedPage] = useState('home')
    const location = useLocation();

    const [user, updateUser] = useState({})

  // See if the user is authorized
  useEffect(() => {
    checkUser(updateUser)

    // Listen for login status changes
    Hub.listen('auth', (data) => {
      const { payload: { event } } = data;
      console.log('event: ', event)
      if (event === 'signIn' || event === 'signOut') { 
        checkUser(updateUser)
      }
    })

    // Determine the current page
    const currentPage = location.pathname.split('/')[1]
    console.log('Current page is: ', location)
    setSelectedPage(currentPage ?currentPage : 'home')

    // update the location
  }, [location])

  return (
    <>
        {/* items is a function to allow flexibility (dynamic admin page display) */}
        <Menu items={getNavLinks(user.isAuthorized)} selectedKeys={[selectedPage]} mode="horizontal" />
        <Outlet/>
    </>
  )
}

export default Nav