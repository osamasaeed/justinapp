import { IonButton, IonContent, IonHeader, IonImg, IonInput, IonItem, IonLabel, IonPage, IonTitle, IonToolbar, useIonAlert, useIonRouter } from '@ionic/react';
import './Login.css';
import IonicBG from '../../assets/images/ionic.jpg'
import * as firebaseService from "../../services/firebase-service";
import { useState } from 'react';
import { FirebaseError } from 'firebase/app';

const Login: React.FC = (props) => {
    const router = useIonRouter();
    const alert = useIonAlert()[0];
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = async (evt: any) => {
        evt.preventDefault();
        // const user = firebaseService.getCurrentUser();
        // console.log(user);

        // console.log(email)
        // console.log(password);
        // const userInfo = await firebaseService.loginWithEmail(email, password);
        // console.log(userInfo);
        // router.push('home');
        try {
            const userInfo = await firebaseService.loginWithEmail(email, password);
            console.log(userInfo);
            router.push('home');
        } catch (error) {
            if (error instanceof FirebaseError) {

                console.log(error.cause);
                console.log(error.code);
                console.log(error.message);
                console.log(error.name);
                console.log(error.customData);
                console.log(error.stack);
                showAlert(error.message)
            }else{
                showAlert(String(error));
            }
        }

    }
    const _handleInputs = (evt: any, fieldName: string) => {
        const value = evt.detail.value;
        if (fieldName === 'email') {
            setEmail(value);
        }
        if (fieldName === 'password') {
            setPassword(value);
        }

    }
    const showAlert = (message: string) => {
        alert(message)
    }
    return (
        <IonPage>
            <IonContent fullscreen>
                <IonImg src={IonicBG} alt='ionic-background'>
                </IonImg>
                <form className="ion-padding" onSubmit={onSubmit}>
                    <IonItem>
                        <IonLabel position="floating">Email Address</IonLabel>
                        <IonInput name='email' value={email} onIonInput={e => _handleInputs(e, 'email')} />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Password</IonLabel>
                        <IonInput name='password' value={password} type="password" onIonInput={e => _handleInputs(e, 'password')} />
                    </IonItem>
                    <IonButton className="ion-margin-top" type="submit" expand="block">
                        Login
                    </IonButton>

                </form>
                <IonButton className="ion-margin-top ion-padding-horizontal" type="button" expand="block">
                    Sign in with Google
                </IonButton>
            </IonContent>
        </IonPage>
    );
};

export default Login;
