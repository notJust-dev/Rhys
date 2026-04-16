import * as Sentry from '@sentry/react-native';
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
    signUpWithEmail: (
        email: string,
        password: string,
        name?: string,
    ) => Promise<void>;
    resetPasswordForEmail: (email: string) => Promise<void>;
    verifyPasswordResetOtp: (email: string, token: string) => Promise<void>;
    updatePassword: (password: string) => Promise<void>;
    verifySignUpOtp: (email: string, token: string) => Promise<void>;
    resendSignUpOtp: (email: string) => Promise<void>;
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

    const captureAuthError = (error: unknown, step: string) => {
        Sentry.captureException(error, {
            tags: { feature: 'auth', step },
        });
    };

    const signInAnonymously = useCallback(async () => {
        const { error } = await supabase.auth.signInAnonymously();
        if (error) {
            captureAuthError(error, 'anonymous_sign_in');
            throw error;
        }
    }, []);

    const signInWithEmail = useCallback(async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            captureAuthError(error, 'email_sign_in');
            throw error;
        }
    }, []);

    const resetPasswordForEmail = useCallback(async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) {
            captureAuthError(error, 'reset_password_email');
            throw error;
        }
    }, []);

    const verifyPasswordResetOtp = useCallback(
        async (email: string, token: string) => {
            const { error } = await supabase.auth.verifyOtp({
                email,
                token,
                type: 'recovery',
            });
            if (error) {
                captureAuthError(error, 'verify_reset_otp');
                throw error;
            }
        },
        [],
    );

    const updatePassword = useCallback(async (password: string) => {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) {
            captureAuthError(error, 'update_password');
            throw error;
        }
    }, []);

    const verifySignUpOtp = useCallback(
        async (email: string, token: string) => {
            const { error } = await supabase.auth.verifyOtp({
                email,
                token,
                type: 'signup',
            });
            if (error) {
                captureAuthError(error, 'verify_signup_otp');
                throw error;
            }
        },
        [],
    );

    const resendSignUpOtp = useCallback(async (email: string) => {
        const { error } = await supabase.auth.resend({ type: 'signup', email });
        if (error) {
            captureAuthError(error, 'resend_signup_otp');
            throw error;
        }
    }, []);

    const signUpWithEmail = useCallback(
        async (email: string, password: string, name?: string) => {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: name ? { data: { full_name: name } } : undefined,
            });
            if (error) {
                captureAuthError(error, 'email_sign_up');
                throw error;
            }
        },
        [],
    );

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
                signUpWithEmail,
                resetPasswordForEmail,
                verifyPasswordResetOtp,
                updatePassword,
                verifySignUpOtp,
                resendSignUpOtp,
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