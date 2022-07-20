import './app.css';
import { Route, Link, Routes, Navigate } from 'react-router-dom';
import { app, auth } from '../configs/firebaseConfig';
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
        <>
          <Header/>
            <Routes>
              <Route path="/:shopId" element={<Branches />} />
              <Route path="/:shopId/:branchId" element={<MenuComponent />} />
              <Route path="/:shopId/:branchId/:menuId" element={<ServicesComponent />} />
              <Route path="/:shopId/:branchId/:menuId/feedback" element={<Feedback />} />
              <Route path="/:shopId/:branchId/:menuId/cart" element={<Cart />} />
              <Route path="/:shopId/:branchId/:menuId/search" element={<Search />} />
              <Route path='/logout' element={<Logout />} />
              <Route path='*' element={<Navigate to='/' replace />} />
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
