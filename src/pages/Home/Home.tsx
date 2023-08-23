import { IonAvatar, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonPage, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import './Home.css';
import * as firebaseService from "../../services/firebase-service";
import IonicBG from '../../assets/images/ionic.jpg'
import { useAuth } from '../../contexts/auth-context';
const Home: React.FC = () => {
  const { user } = useAuth();
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

        <IonCard className='userData'>
          <IonImg src={IonicBG} alt='ionic-background'>
          </IonImg>
          <IonAvatar className='userAvatar'>
            <img alt="Silhouette of a person's head" width={100} height={100} src={user?.photoURL || "https://ionicframework.com/docs/img/demos/avatar.svg"} />
          </IonAvatar>
          <IonCardHeader>
            <IonCardTitle>Name: {user?.displayName}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>Email: {user?.email}</p>
            <p>User ID: {user?.uid}</p>
          </IonCardContent>
        </IonCard>

      </IonContent>
    </IonPage>
  );
};

export default Home;
