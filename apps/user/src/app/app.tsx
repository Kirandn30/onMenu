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
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';


export function App() {
  const dispatch = useDispatch()
  const { loading, user, name, phoneNumber } = useSelector((state: RootState) => state.User)

  // const clickFunc= () => {
  //   const auth = getAuth();
  //   signOut(auth).then(() => {
  //     // Sign-out successful.
  //   }).catch((error) => {
  //     // An error happened.
  //   });
  // }

  // clickFunc()

  useEffect(() => {
    const Unsubscribe = onAuthStateChanged(auth, async (cred) => {
      dispatch(setUser(cred))
    })

    return () => Unsubscribe()
  }, [])

  useEffect(() => {
    if (user) {
      addUser()
    }
  }, [user])

  async function addUser() {
    if (user) {
      const id = user.uid
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("user exists")
        updateDoc(doc(db, "users", id), {
          timeStamp: serverTimestamp(),
        })
      } else {
        console.log("User dosen't exists");
        setDoc(doc(db, "users", id), {
          name,
          phoneNumber,
          timeStamp: serverTimestamp(),
        })
      }

    }
  }

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
              <Route path=":shopId/search" element={<Search />} />
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
