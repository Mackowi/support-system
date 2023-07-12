import { Navigate, Outlet } from 'react-router-dom'
import { UserAuthStatus } from '../hooks/UserAuthStatus'
import Spinner from './Spinner'

const PrivateRoute = () => {
  const { loggedIn, checkingStatus } = UserAuthStatus()

  if (checkingStatus) {
    return <Spinner />
  }

  return loggedIn ? <Outlet /> : <Navigate to='/login' />
}
export default PrivateRoute
