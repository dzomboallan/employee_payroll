import React, { useState, useEffect } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { app } from './firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const auth = getAuth(app);

function PrivateRoute({ path, ...props }) {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (authenticated) {
    if (path === '/' || path === '/adminlogin' || path === '/hrlogin') {
      return <Route {...props} path={path} />;
    } else {
      return <Navigate to="/" />;
    }
  } else {
    return <Navigate to="/" />;
  }
}

export default PrivateRoute;