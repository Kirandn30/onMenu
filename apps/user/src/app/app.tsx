import './app.css';

import { Route, Link, Routes, Navigate } from 'react-router-dom';
import { app, auth } from '../configs/firebaseConfig';
import Auth from '../features/auth/auth';
import { useEffect } from 'react';
import { RootState } from '../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { setUser } from '../features/auth/authSlice';
import { CircularProgress } from '@mui/material';
import Logout from '../features/auth/logout';
import { Home } from './home';


export function App() {
  const dispatch = useDispatch()
  const { loading, user } = useSelector((state: RootState) => state.User)

  useEffect(() => {
    const Unsubscribe = onAuthStateChanged(auth, async (cred) => {
      dispatch(setUser(cred))
    })
    return () => Unsubscribe()

  }, [])

  if (loading) return <CircularProgress />
  return (
    <div>
      {user ? (
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes >
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














































// import { CircularProgress } from "@mui/material";
// // eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
// import { auth } from "apps/user/firebase";
// import { onAuthStateChanged } from "firebase/auth";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Route, Routes } from "react-router-dom";
// import { RootState } from "../redux/store";
// import "./app.css"
// import Auth from "./auth/auth";
// import { setUser } from "./auth/authSlice";
// import Logout from "./auth/logout";
// import { Registration } from "./auth1/registration";

// export function App() {
//   const dispatch = useDispatch()
//   const { loading } = useSelector((state: RootState) => state.User)


//   useEffect(() => {
//     const Unsubscribe = onAuthStateChanged(auth, async (cred) => {
//       dispatch(setUser(cred))
//     })
//     return () => Unsubscribe()

//   }, [])


//   if (loading) return <CircularProgress />
//   return (
//     <div>
//       <Routes>
//         <Route path='/' element={<Registration />} />
//         <Route path='/logout' element={<Logout />} />
//         <Route path='*' element={<>not found</>} />
//       </Routes>
//     </div>
//   );
// }


// export default App;
