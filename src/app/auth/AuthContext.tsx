import { createContext, ReactNode, useContext, useState } from 'react';
import { AppUser, authenticate } from './users';

interface AuthContextType {
    user: AppUser | null;
    login: (username: string, passcode: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_KEY = 'dbt_vc_user';

function getStoredUser(): AppUser | null {
    try {
        const raw = sessionStorage.getItem(SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AppUser | null>(getStoredUser);

    const login = (username: string, passcode: string): boolean => {
        const found = authenticate(username, passcode);
        if (found) {
            setUser(found);
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(found));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem(SESSION_KEY);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be inside AuthProvider');
    return ctx;
}
