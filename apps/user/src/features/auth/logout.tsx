import { useEffect } from "react";
import { app } from "../../configs/firebaseConfig";
import usePhoneAuth from "./phoneAuthHook";

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {}

// eslint-disable-next-line no-empty-pattern
export default function Logout({}: Props) {

const {logout}=    usePhoneAuth(app)

useEffect(() => {
    logout()
}, [])

    
  return null;
}
