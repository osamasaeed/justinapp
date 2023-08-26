import { IonAvatar, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonPage, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import './Home.css';
import IonicBG from '../../assets/images/ionic.jpg'
import { useAuth } from '../../contexts/auth-context';
import { useEffect } from 'react';
const Home: React.FC = () => {
  const { user, signOut } = useAuth();
  const router = useIonRouter();

  useEffect(() => {
    console.log("user:", user);

    return () => {

    }
  }, [])


  const Logout = async () => {
    await signOut();
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
            <img alt="Silhouette of a person's head" width={100} height={100} src={user?.imageUrl || "https://ionicframework.com/docs/img/demos/avatar.svg"} />
          </IonAvatar>
          <IonCardHeader>
            <IonCardTitle>Name: {user?.name}</IonCardTitle>
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
