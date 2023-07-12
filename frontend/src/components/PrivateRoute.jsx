import { Navigate, Outlet } from 'react-router-dom'
import { userAuthStatus } from '../hooks/useAuthStatus'
import Spinner from './Spinner'

const PrivateRoute = () => {
  const { loggedIn, checkingStatus } = userAuthStatus()

  if (checkingStatus) {
    return <Spinner />
  }

  return loggedIn ? <Outlet /> : <Navigate to='/login' />
}
export default PrivateRoute
