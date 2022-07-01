import { Shopcard } from '../features/auth/shopCard';
import { Routes, Route, useParams, Navigate, useNavigate } from "react-router-dom"
import './app.css'
import { Login } from '../features/auth/login';
import { SignUp } from '../features/auth/signUp';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useEffect } from 'react';
import { setError, setLoading, setNotification, setUser } from '../redux/auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import CircularProgress from '@mui/material/CircularProgress';
import { Alert, Snackbar, Typography } from '@mui/material';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { setselectedShop, Setshops } from '../redux/shops';
import { Header } from '../components/header';
import { NewHeader } from '../components/newHeader';
import { Service } from '../features/auth/navOptions/service/service';
import { Activecustomers } from '../features/auth/navOptions/activeCx';
import { Analytics } from '../features/auth/navOptions/analytics';
import { Bin } from '../features/auth/navOptions/bin';
import { CustomersList } from '../features/auth/navOptions/customersList';
import { Instructions } from '../features/auth/navOptions/instructions';
import { Payments } from '../features/auth/navOptions/payments';
import { Loyalty } from '../features/auth/navOptions/loyalty';
import { Servicealert } from '../features/auth/navOptions/servicealert';
import { Settings } from '../features/auth/navOptions/settings';
import { SetShop } from '../components/Setshop';


export function App() {

  const { User, loading, error, notification } = useSelector((state: RootState) => state.auth)
  const { selectedShop } = useSelector((state: RootState) => state.shop)
  const dispatch = useDispatch()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const userEmail = user.email
          const emailRef = collection(db, "roles")
          const q = query(emailRef, where("adminEmail", "==", userEmail))
          const docSnap = await getDocs(q)
          if (docSnap.size > 0) {
            const shops = docSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            dispatch(Setshops(shops))
            dispatch(setUser(user))
          } else {
            dispatch(setError("Not authorized contact On Menu"))
            dispatch(setLoading(false))
            await signOut(auth)
          }
        } else {
          dispatch(setUser(null))
        }
      } catch (error) {
        dispatch(setError(error))
      }
    });
    return () => unsub()
  }, [])

  return (
    <div>
      <Snackbar open={Boolean(error)} autoHideDuration={5000} onClose={() => dispatch(setError(null))}>
        <Alert severity='error'>{error}</Alert>
      </Snackbar>
      <Snackbar open={Boolean(notification)} autoHideDuration={5000} onClose={() => dispatch(setNotification(null))}>
        <Alert severity='success'>{notification}</Alert>
      </Snackbar>
      {loading ? (
        <div style={{ height: "80vh", width: "99vw", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <CircularProgress />
        </div>
      ) : (
        <div>
          {User ? (
            !selectedShop ? (
              <Routes>
                <Route path="/:shopid/:branchid/:menuId/:categoryId" element={<SetShop />} />
                <Route path="/:shopid/:branchid/:menuId" element={<SetShop />} />
                <Route path="/:shopid/:branchid" element={<SetShop />} />
                <Route path="/:shopid" element={<SetShop />} />
                <Route path="*" element={<Shopcard />} />
              </Routes>
            ) : (
              < NewHeader>
                <Routes>

                  <Route path='/:shopid/activecustomers' element={<Activecustomers />} />
                  <Route path='/:shopid/analytics' element={<Analytics />} />
                  <Route path='/:shopid/bin' element={<Bin />} />
                  <Route path='/:shopid/customerslist' element={<CustomersList />} />
                  <Route path='/:shopid/instructions' element={<Instructions />} />
                  <Route path='/:shopid/payment' element={<Payments />} />
                  <Route path='/:shopid/loyalty' element={<Loyalty />} />
                  <Route path='/:shopid/alerts' element={<Servicealert />} />
                  <Route path='/:shopid/settings' element={<Settings />} />
                  <Route path='/:shopid/:branchid/:menuId/:categoryId' element={<Service />} />
                  <Route path='/:shopid/:branchid/:menuId' element={<Service />} />
                  <Route path='/:shopid/:branchid' element={<Service />} />
                  <Route path='/:shopid' element={<Service />} />
                  <Route path='*' element={<Typography variant='h5' textAlign="center">Not Found</Typography>} />
                </Routes>
              </NewHeader>
            )
          ) : (
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="*" element={<Login />} />

            </Routes>
          )}
        </div >
      )
      }
    </div >
  );
}

export default App;