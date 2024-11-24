import React from 'react'
import NavBar from './NavBar'
import { NavLink } from 'react-router-dom'

export default function ErrorPage() {
  return (
    <>
    <div>
      <NavBar/>
      <div className="d-flex flex-column justify-content-center align-items-center">
      <div className='display-3'>404 Not Found</div>
      <p>The page you are looking for is not exist.</p>
      <NavLink to="/" className='btn btn-danger'>Return back to Home Page</NavLink>
      </div>
    </div>
    </>
  )
}
