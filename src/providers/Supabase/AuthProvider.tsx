import { Session, User } from '@supabase/supabase-js';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { useQueryClient } from '@tanstack/react-query';
import { supabase } from './client';

type AuthContextType = {
    session: Session | null;
    user: User | null;
    isAnonymous: boolean;
    isAuthenticated: boolean;
    signInAnonymously: () => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state: string) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh();
    } else {
        supabase.auth.stopAutoRefresh();
    }
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const queryClient = useQueryClient();

    useEffect(() => {
        const initializeAuth = async () => {
            const { data: { session: existingSession } } = await supabase.auth.getSession();

            if (existingSession) {
                setSession(existingSession);
            }

            setLoading(false);
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
            setSession(newSession);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signInAnonymously = useCallback(async () => {
        const { error } = await supabase.auth.signInAnonymously();
        if (error) {
            // Sentry.captureException(error, {
            //     tags: { feature: 'auth', step: 'anonymous_sign_in' },
            // });
            console.error('Error signing in anonymously:', error);
            throw error;
        }
    }, []);

    const signInWithEmail = useCallback(async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            console.error('Error signing in with email:', error);
            throw error;
        }
    }, []);

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ['profile'] });
    }, [session?.user?.id])

    if (loading) {
        return null;
    }

    const isAnonymous = session?.user?.is_anonymous ?? false;
    const isAuthenticated = !!session;

    return (
        <AuthContext.Provider
            value={{
                session,
                user: session?.user ?? null,
                isAnonymous,
                isAuthenticated,
                signInAnonymously,
                signInWithEmail,
            }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const useUser = () => useAuth().user;