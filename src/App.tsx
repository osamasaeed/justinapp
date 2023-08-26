import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, isPlatform, setupIonicReact, useIonRouter } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import { AuthProvider, useAuth } from './contexts/auth-context';
import { Plugins } from '@capacitor/core';
// import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { useEffect } from 'react';

setupIonicReact();

const App: React.FC = () => {
  const { user } = useAuth();
  useEffect(() => {
    console.log(isPlatform("desktop"));
    console.log('isWeb');
    Plugins.GoogleAuth.initialize({
      grantOfflineAccess: true,
    });


    return () => {

    }
  }, [])


  console.log("App:", user)

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/login" >
            <Login />
          </Route>
          <PrivateRoute path="/home" component={Home} />
          {user ? <Redirect exact to="/home" /> : <Redirect exact to="/login" />}
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}


const PrivateRoute: React.FC<{ path: string; component: React.FC }> = ({ path, component: Component }) => {
  const { user } = useAuth();
  console.log("PrivateRoute:", user);
  return <Route path={path} render={() => (user ? <Component /> : <Redirect to="/login" />)} />;
};

export default App;
