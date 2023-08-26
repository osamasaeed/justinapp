
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { logOut, loginWithEmail, loginViaGoogle } from '../services/firebase-service';

// Define the shape of your auth context
interface AuthContextType {
    user: User | null;
    signIn: (email: string, password: string) => Promise<void>;
    signInViaGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

// Create the Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a custom hook to access the Auth Context
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
interface User {
    name: string,
    email: string,
    imageUrl: string,
    uid: string

}
// Create the Auth Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    // Load persisted state during initialization
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);
    const signIn = async (email: string, password: string) => {
        // Implement your Firebase sign-in logic here
        const userInfo = await loginWithEmail(email, password);
        if (!userInfo) return;
        setUser({
            uid: userInfo.user.uid,
            email: userInfo.user.email || '',
            name: userInfo.user.displayName || '',
            imageUrl: userInfo.user.photoURL || ''
        });
        // After successful sign-in, set user state and persist
        localStorage.setItem('user', JSON.stringify(userInfo.user));
    };

    const signInViaGoogle = async () => {
        const userInfo: any = await loginViaGoogle();
        if (!userInfo) return;
        setUser({
            uid: userInfo.uid,
            email: userInfo.email,
            name: userInfo.name,
            imageUrl: userInfo.imageUrl
        });
        // After successful sign-in, set user state and persist
        localStorage.setItem('user', JSON.stringify(userInfo));
    }

    const signOut = async () => {
        // Implement your Firebase sign-out logic here
        await logOut();
        // After successful sign-out, clear user state and persisted data
        localStorage.removeItem('user');
        // Set user state null
        setUser(null)
    };

    const authContextValue: AuthContextType = {
        user,
        signIn,
        signInViaGoogle,
        signOut,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
}
