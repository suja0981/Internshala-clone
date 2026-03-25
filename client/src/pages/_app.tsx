import Footer from "@/component/Footer";
import Navbar from "@/component/Navbar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { store } from "../store/store";
import { Provider, useDispatch } from "react-redux";
import { useEffect } from "react";
import { auth } from "@/firebase/firebase";
import { login, logout } from "@/Feature/Userslice";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function App({ Component, pageProps }: AppProps) {
  function AuthListener() {
    const dispatch = useDispatch();
    useEffect(() => {
      auth.onAuthStateChanged((authuser) => {
        if (authuser) {
          dispatch(
            login({
              uid: authuser.uid,
              photo: authuser.photoURL,
              name: authuser.displayName,
              email: authuser.email,
              phoneNumber: authuser.phoneNumber,
            })
          );
        } else {
          dispatch(logout());
        }
      });
    }, [dispatch]);
    return null;
  }

  return (
    <Provider store={store}>
      <AuthListener />
      <div className="bg-white">
        <ToastContainer />
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </div>
    </Provider>
  );
}