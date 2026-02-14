import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';

export function AuthScreen() {
    return (
        <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-pink-100">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-black text-pink-600">100 Citas</h1>
                    <p className="text-gray-400 text-sm">Ingresa para empezar la aventura</p>
                </div>

                <Auth
                    supabaseClient={supabase}
                    appearance={{
                        theme: ThemeSupa,
                        variables: {
                            default: {
                                colors: {
                                    brand: '#ec4899', // Color rosa (pink-500)
                                    brandAccent: '#db2777',
                                },
                                radii: {
                                    borderRadiusButton: '12px',
                                    inputBorderRadius: '12px',
                                }
                            }
                        }
                    }}
                    providers={[]} // Dejamos el array vacío para solo usar Email/Password
                    localization={{
                        variables: {
                            sign_in: {
                                email_label: 'Correo electrónico',
                                password_label: 'Contraseña',
                                button_label: 'Iniciar Sesión',
                            },
                            sign_up: {
                                email_label: 'Correo electrónico',
                                password_label: 'Contraseña',
                                button_label: 'Registrarse',
                                link_text: '¿No tienes cuenta? Regístrate',
                            }
                        }
                    }}
                />
            </div>
        </div>
    );
}