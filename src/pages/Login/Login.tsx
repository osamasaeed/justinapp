import { IonButton, IonContent, IonHeader, IonImg, IonInput, IonItem, IonLabel, IonPage, IonTitle, IonToolbar, useIonAlert, useIonRouter } from '@ionic/react';
import './Login.css';
import IonicBG from '../../assets/images/ionic.jpg'
import { useEffect, useState } from 'react';
import { FirebaseError } from 'firebase/app';
import { useAuth } from '../../contexts/auth-context';

const Login: React.FC = () => {
    const router = useIonRouter();
    const { user, signIn, signInViaGoogle } = useAuth();
    const alert = useIonAlert()[0];
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (user) {
            router.push('home');
        }
        return () => {
        }
    }, [user])

    const onSubmit = async (evt: any) => {
        evt.preventDefault();
        try {
            await signIn(email.trim(), password.trim());
        } catch (error) {
            if (error instanceof FirebaseError) {

                console.log(error.cause);
                console.log(error.code);
                console.log(error.message);
                console.log(error.name);
                console.log(error.customData);
                console.log(error.stack);
                showAlert(error.message)
            } else {
                showAlert(String(error));
            }
        }

    }
    const signInWithGoogle = async () => {
        try {
            const user = await signInViaGoogle();
            console.log("signInWithGoogle", user)
        } catch (error) {
            console.log(error);
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
                <IonButton onClick={signInWithGoogle} className="ion-margin-top ion-padding-horizontal" type="button" expand="block">
                    Sign in with Google
                </IonButton>
            </IonContent>
        </IonPage>
    );
};

export default Login;
