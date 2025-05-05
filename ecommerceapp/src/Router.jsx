import { Routes, Route } from 'react-router-dom'

import Nav from './Nav'
import Admin from './Admin'
import Home from './Home'
import Profile from './Profile'
import Final from './Final'

export default function Router() {
  
  return (
    <Routes>
        <Route path="/" element={<Nav/>}>
            <Route index element={<Home/>} />
            <Route path='/admin' element={<Admin/>} />
            <Route path='/profile' element={<Profile/>} />
            <Route path='/final' element={<Final/>} />
            <Route path="*" element={<Home/>} />
        </Route>
    </Routes>
        
  )
}