import './app.css';
import { Route, Link, Routes, Navigate } from 'react-router-dom';
import { app, auth, db } from '../configs/firebaseConfig';
import Auth from '../features/auth/auth';
import { useEffect } from 'react';
import { RootState } from '../redux/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { setUser } from '../redux/authSlice';
import { CircularProgress } from '@mui/material';
import Logout from '../features/auth/logout';
import { Branches } from '../components/branches';
import { MenuComponent } from '../components/menu';
import { Header } from '../components/header';
import { ServicesComponent } from '../components/services';
import { Feedback } from '../components/feedback';
import { Cart } from '../components/cart';
import { Search } from '../components/search';
import { Payment } from '../components/payment';
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { Timings } from '../components/timings';


export function App() {
  const dispatch = useDispatch()
  const { loading, user, name, phoneNumber } = useSelector((state: RootState) => state.User)

  useEffect(() => {
    const Unsubscribe = onAuthStateChanged(auth, async (cred) => {
      dispatch(setUser(cred))
    })

    return () => Unsubscribe()
  }, [])

  if (loading || user === undefined) return <CircularProgress />
  return (
    <div>
      {user ? (
        <>
          <Routes>
            <Route path="/" element={<Header />} >
              <Route path=":shopId" element={<Branches />} />
              <Route path=":shopId/:branchId" element={<MenuComponent />} />
              <Route path=":shopId/:branchId/:menuId" element={<ServicesComponent />} />
              <Route path=":shopId/feedback" element={<Feedback />} />
              <Route path=":shopId/cart" element={<Cart />} />
              <Route path=":shopId/timings" element={<Timings />} />
              <Route path=":shopId/:branchId/search" element={<Search />} />
              <Route path=":shopId/payment" element={<Payment />} />
              <Route path='logout' element={<Logout />} />
              <Route path='*' element={<Navigate to='/' replace />} />
            </Route>
          </Routes >
        </>
      ) : (
        <Routes>
          <Route path='/' element={<Auth />} />
          <Route path='*' element={<Auth />} />
        </Routes >
      )}
    </div>
  )
}

export default App;
