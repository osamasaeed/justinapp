import { User } from 'firebase/auth';
import { createContext, useContext, useState, ReactNode } from 'react';
import { logOut, loginWithEmail } from '../services/firebase-service';


// Define the shape of your auth context
interface AuthContextType {
    user: User | null;
    signIn: (email: string, password: string) => Promise<void>;
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

// Create the Auth Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const signIn = async (email: string, password: string) => {
        // Implement your Firebase sign-in logic here
        const userInfo = await loginWithEmail(email, password);
        setUser(userInfo.user);
    };

    const signOut = async () => {
        // Implement your Firebase sign-out logic here
        await logOut();
        setUser(null)
    };

    const authContextValue: AuthContextType = {
        user,
        signIn,
        signOut,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
}
