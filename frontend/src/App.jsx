import React,
{
  useEffect,
  useState
}
from "react";

import SplashScreen
from "./pages/SplashScreen";

import AppRouter
from "./routes/AppRoutes";

export default function App() {

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const timer =
      setTimeout(() => {

        setLoading(false);

      }, 3000);

    return () =>
      clearTimeout(timer);

  }, []);

  return (

    <>

      {loading ? (

        <SplashScreen />

      ) : (

        <AppRouter />

      )}

    </>

  );

}