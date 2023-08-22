import { IonButton, IonContent, IonHeader, IonIcon, IonItem, IonPage, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import './Home.css';
import * as firebaseService from "../../services/firebase-service";
import { useEffect } from 'react';

const Home: React.FC = () => {
  const router = useIonRouter();

  const Logout = async () => {
    await firebaseService.logOut();
    router.push('login');
  }
  return (
    <IonPage>

      <IonContent fullscreen>
        <IonItem lines='none'>
          <IonButton size={'default'} fill={'outline'} slot='end' onClick={Logout}>Logout</IonButton>
        </IonItem>

      </IonContent>
    </IonPage>
  );
};

export default Home;
