import { supabase } from '../lib/supabase';
import type { DateIdea } from '../types/types';

export const apiService = {
    // Obtener todas las sesiones del usuario
    async getMySessions() {
        const { data, error } = await supabase.rpc('get_user_sessions_with_stats'); // Llama a la nueva versión
        if (error) return [];

        return data.map((item: any) => ({
            id: item.session_id,
            name: item.name,
            description: item.description, // <--- Mapeamos la descripción
            completedCount: item.completed_count || 0
        }));
    },

    // Obtener una sesión específica por ID
    async getSessionById(sessionId: string) {
        const { data, error } = await supabase
            .from('sessions')
            .select('*')
            .eq('id', sessionId)
            .single();

        if (error) return null;
        return data;
    },

    // Crear sesión usando la función RPC segura
    async createSession(name: string, description?: string) {
        const { data, error } = await supabase.rpc('create_session_with_user', {
            session_name: name,
            session_description: description || null // <--- Enviamos el parámetro nuevo
        });

        if (error) throw error;
        return data;
    },

    // Unirse con código
    async joinWithCode(code: string) {
        const { data, error } = await supabase.rpc('join_session_secure', {
            invite_code: code.toUpperCase()
        });
        if (error) throw error;
        return data;
    },

    // Generar código de 10 min
    async generateInviteCode(sessionId: string) {
        const { data, error } = await supabase.rpc('generate_invite_code', {
            target_session_id: sessionId
        });
        if (error) throw error;
        return data.code;
    },

    // Obtener siguiente cita
    async getNextDate(sessionId: string): Promise<DateIdea | null> {
        const { data, error } = await supabase.rpc('get_random_date', {
            current_session_id: sessionId
        });
        if (error) throw error;
        return data && data.length > 0 ? (data[0] as DateIdea) : null;
    },

    async completeDate(sessionId: string, dateIdeaId: string, files: [File, File]) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No estás logueado");

        // Pequeña función interna para subir 1 foto y devolver la ruta + URL
        const uploadPhoto = async (file: File) => {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${sessionId}/${fileName}`;

            const { error } = await supabase.storage.from('photos').upload(filePath, file);
            if (error) throw error;

            const { data } = supabase.storage.from('photos').getPublicUrl(filePath);
            return { path: filePath, url: data.publicUrl };
        };

        const photo1 = await uploadPhoto(files[0]);
        const photo2 = await uploadPhoto(files[1]);

        // Guardamos el registro con las 2 URLs
        const { data: memory, error: dbError } = await supabase
            .from('memories')
            .insert({
                session_id: sessionId,
                date_idea_id: dateIdeaId,
                user_id: user.id,
                photo_url: photo1.url,
                photo_url_2: photo2.url
            })
            .select()
            .single();

        if (dbError) {
            // Evita fotos huérfanas en el bucket si el insert falla (p.ej. la pareja ya cargó esta cita).
            await supabase.storage.from('photos').remove([photo1.path, photo2.path]);

            if (dbError.code === '23505') {
                throw Object.assign(new Error('DUPLICATE_MEMORY'), { code: 'DUPLICATE_MEMORY' });
            }
            throw dbError;
        }

        return memory;
    },

    async getMemories() {
        const { data, error } = await supabase
            .from('memories')
            .select(`
        id,
        photo_url,
        photo_url_2,
        created_at,
        date_ideas ( title ),
        sessions ( name )`)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error cargando la galería:", error);
            return [];
        }
        return data;
    }
};