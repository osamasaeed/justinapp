import { getApp, getApps, initializeApp } from "firebase/app";
import { collection, doc, getFirestore, setDoc } from "firebase/firestore";
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, signInWithCredential, signInWithEmailAndPassword } from "firebase/auth";
import '@codetrix-studio/capacitor-google-auth';
import { Plugins } from '@capacitor/core';
const { GoogleAuth } = Plugins;
var firebaseConfig = {
    apiKey: "AIzaSyBX7LcBVQ6YFzq3UCeP_O64__Nf_p7FmjU",
    authDomain: "justinapp-11f30.firebaseapp.com",
    projectId: "justinapp-11f30",
    storageBucket: "justinapp-11f30.appspot.com",
    messagingSenderId: "10779002422",
    appId: "1:10779002422:web:60c8e7f23a25065684ba97"

    /// Justin Credentials
    // apiKey: "AIzaSyBUkFth4c1SF99m3XF6FCIj9FysTuctqs8",
    // authDomain: "golf-snap.firebaseapp.com",
    // projectId: "golf-snap",
    // storageBucket: "golf-snap.appspot.com",
    // messagingSenderId: "153076236362",
    // appId: "1:153076236362:web:54ef9e8c4610b6d8e5a6b3",
    // measurementId: "G-TPHBE62KV8"
};

// Ensure that you do not login twice.
if (!getApps().length) {
    initializeApp(firebaseConfig);
}

const app = getApp();
const auth = getAuth(app);
const firestore = getFirestore(app);
// const firestore = firebase.firestore();
// const settings = { timestampsInSnapshots: true };
// firestore.settings(settings);

/**
 * so this function is called when the authentication state changes
 * in the application, a side effect of that is that we need to get
 * the rest of the user data from the user collection, that is
 * done with the _handleAuthedUser callback
 */
export const authCheck = async (_handleAuthedUser: CallableFunction) => {
    return new Promise((resolve) => {
        // Listen for authentication state to change.
        auth.onAuthStateChanged(async (user: any) => {
            if (user != null) {
                console.log("We are authenticated now!");

                return resolve(await _handleAuthedUser(user));
            } else {
                console.log("We did not authenticate.");
                _handleAuthedUser(null);
                return resolve(null);
            }
        });
    });
};

/**
 *
 * @param {*} email
 * @param {*} password
 */
export const loginWithEmail = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const getCurrentUser = () => {

    return auth.currentUser;
};
/**
 *
 */
export const logOut = async () => {
    await auth.signOut();
    await GoogleAuth.signOut().then(() => console.log('Signed Out')).catch((e: any) => { console.log('Signed Out') });
};

/**
 *
 * @param {*} userInfo.lastName
 * @param {*} userInfo.firstName
 * @param {*} userInfo.email
 * @param {*} userInfo.password
 */
interface userInfo {
    lastName: string
    firstName: string
    email: string
    password: string
}
export const registerUser = async (userInfo: userInfo) => {
    console.log("in registerUser");
    try {
        const newUser = await createUserWithEmailAndPassword(auth, userInfo.email, userInfo.password);
        let { email, firstName, lastName } = userInfo;
        const usersCollection = collection(firestore, 'users');
        const userDocRef = doc(usersCollection, newUser.user.uid);
        await setDoc(userDocRef, {
            email,
            firstName,
            lastName,
        })
        return { ...newUser.user, firstName, lastName };
    } catch (error) {
        console.error('Error writing document: ', error);
    }
};

export const loginViaGoogle = async () => {
    try {
        // if (!(isPlatform('android') || isPlatform('ios'))) {
        // console.log('isWeb');
        // GoogleAuth.initialize({
        //     grantOfflineAccess: true
        // });
        // }
        const user = await GoogleAuth.signIn();
        if (user) {
            // Sign in with credential from the Google user.
            const s = await signInWithCredential(getAuth(app), GoogleAuthProvider.credential(user.authentication.idToken))
            const access_token = await s.user.getIdToken();
            console.log("user:", user);
            console.log("s.user:", s.user);
            const userInfo = { name: s.user.displayName || user.name || user.givenName + " " + user.familyName, email: user.email, imageUrl: user.imageUrl, uid: s.user.uid };

            return userInfo;

        }
    } catch (error) {
        console.log(error);
        // return error;
    }
}

// /**
//  *
//  */
// export const getUserProfile = () => {
//     let user = auth.currentUser;
//     console.log(user);
//     const usersCollection = collection(firestore, 'users');
//     const userRef = doc(usersCollection, user.uid);

//     return userRef
//         .get()
//         .then((doc) => {
//             if (doc.exists) {
//                 console.log("Document data:", doc.data());
//                 return {
//                     ...doc.data(),
//                     id: user.uid,
//                 };
//             } else {
//                 // doc.data() will be undefined in this case
//                 console.log("No such document!", user.uid);
//                 return null;
//             }
//         })
//         .catch((error) => {
//             console.log("Error getting document:", error);
//         });
// };

// /**
//  *
//  * @param {*} param0
//  */
// export const queryObjectCollection = ({ collection }) => {
//     let currentUserId = firebase.auth().currentUser.uid;
//     let collectionRef = firebase.firestore().collection(collection);

//     let results = [];

//     return (
//         collectionRef
//             //.where('owner', '==', currentUserId)
//             .get()
//             .then((querySnapshot) => {
//                 querySnapshot.forEach((doc) => {
//                     // doc.data() is never undefined for query doc snapshots
//                     results.push({
//                         id: doc.id,
//                         ...doc.data(),
//                     });
//                 });
//                 return results;
//             })
//             .catch((error) => {
//                 console.log("Error getting documents: ", error);
//                 return error;
//             })
//     );
// };

// /**
//  *
//  * @param {*} _collection - name of collection to add object to
//  * @param {*} _objectData - data to add to the collection
//  */
// export const addObjectToCollection = ({ collection, objectData }) => {
//     let currentUserId = firebase.auth().currentUser.uid;
//     let collectionRef = firebase.firestore().collection(collection);

//     return collectionRef
//         .add({
//             owner: currentUserId,
//             content: { ...objectData },
//             created: new Date().getTime(),
//             updated: new Date().getTime(),
//         })
//         .then(
//             async (doc) => {
//                 console.log(`addObjectToCollection ${collection} ${doc}`);

//                 let docData = await getByRef(doc);
//                 return docData;
//             },
//             (error) => {
//                 console.log(`ERROR: addObjectToCollection ${collection} ${error}`);
//                 return error;
//             }
//         )
//         .catch((e) => {
//             console.log(`ERROR: addObjectToCollection ${collection} ${e}`);
//             return e;
//         });
// };

// /**
//  *
//  * @param {*} collection - name of collection
//  * @param {*} objectId - id of data to remove from the collection
//  */
// export const removeObjectFromCollection = ({ collection, objectId }) => {
//     let currentUserId = firebase.auth().currentUser.uid;
//     let collectionRef = firebase.firestore().collection(collection);

//     return collectionRef
//         .doc(objectId)
//         .delete()
//         .then(
//             async (doc) => {
//                 console.log(`removeObjectFromCollection ${collection} ${objectId}`);
//                 return true;
//             },
//             (error) => {
//                 console.log(`ERROR: removeObjectFromCollection ${collection} ${error}`);
//                 return error;
//             }
//         )
//         .catch((e) => {
//             console.log(`ERROR: removeObjectFromCollection ${collection} ${e}`);
//             return e;
//         });
// };

// export const getByRef = (_documentRef) => {
//     return _documentRef
//         .get()
//         .then((doc) => {
//             if (doc.exists) {
//                 return { ...doc.data(), id: _documentRef.id };
//             } else {
//                 // doc.data() will be undefined in this case
//                 console.log("No such document!");
//                 return null;
//             }
//         })
//         .catch((error) => {
//             console.log("Error getting document:", error);
//             return error;
//         });
// };

// /**
//  *
//  * @param {*} blob
//  */
// export const uploadImage = (blob) => {
//     return new Promise((resolve, reject) => {
//         let currentUserId = firebase.auth().currentUser.uid;
//         const ref = firebase
//             .storage()
//             .ref(currentUserId)
//             .child(new Date().getTime() + "-" + currentUserId + ".jpeg");

//         const task = ref.put(blob);

//         task.on(
//             firebase.storage.TaskEvent.STATE_CHANGED,
//             (snapshot) =>
//                 console.log((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
//             (error) => {
//                 console.log("error", error);
//                 return reject(error);
//             },
//             (result) => {
//                 return resolve({
//                     url: task.snapshot.downloadURL,
//                     contentType: task.snapshot.metadata.contentType,
//                     name: task.snapshot.metadata.name,
//                     size: task.snapshot.metadata.size,
//                 });
//             }
//         );
//     });
// };