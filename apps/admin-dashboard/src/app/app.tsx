// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { firebase } from '../../firebase';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import './app.css';
import { Auth } from './auth/Auth';
import { setUser } from './auth/authSlice';
import { RootState } from './Reduxstore/store';
import { CircularProgress, Fade, TextField } from '@mui/material';
import { Dashboard } from './dashboard/Dashboard';
import { AddShop } from './dashboard/AddShop';
import { Header } from './dashboard/Header';

export function App() {

  const dispatch = useDispatch()
  const auth = getAuth(firebase)
  const { user, loading } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      if (user && user.uid === "lgNXbD1hvzdmbFObz4e5Y7KwjM03") {
        dispatch(setUser(user))
      } else {
        dispatch(setUser(null))
        signOut(auth)
      }
    });

    return unSub()
  }, [])




  return (
    <div>
      {loading ? (
        <div>
          <CircularProgress />
        </div>
      ) : (
        <div>
          <Header />
          {
            user ? (
              <Routes>
                <Route path='/' element={<Dashboard />} />
                <Route path='/add' element={<AddShop />} />
                <Route path='/edit/:id' element={<AddShop editMode={true} />} />
              </Routes >
            ) : (
              <Routes>
                <Route path='/' element={<Auth />} />
              </Routes>
            )
          }
        </div>
      )
      }
    </div >
  )


}

export default App;


