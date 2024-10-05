import { supabase } from "./supabase"

export default async function getUsernamesByUserIds(userIds) {
    try {
        const idsArray = Array.isArray(userIds) ? userIds : [userIds]
        let { data, error } = await supabase
            .from('users')
            .select('user_id, username')
            .in('user_id', idsArray);

        if (error) {
            console.error("Error fetching usernames: " + error.message)
            return null;
        }

        return data;
    } catch (err) {
        console.error('Error in getUsernamesByUserIds function:', err);
        return null;
    }
}