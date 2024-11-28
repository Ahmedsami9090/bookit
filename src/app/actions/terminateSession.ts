'use server'
import { createSessionClient } from "../../../config/appwrite"
import { cookies } from "next/headers"
export async function terminateSession(): Promise<{ success: string } | { error: string }> {
    const sessionCookie = (await cookies()).get('appwrite-session')
    if (!sessionCookie) {
        return { error: 'Session cookies not found' }
    }
    try {
        const { account } = await createSessionClient(sessionCookie.value)
        await account.deleteSession('current')
            ; (await cookies()).delete('appwrite-session')
        return { success: 'Logged out successfully' }
    } catch (error) {
        console.log(error);
        return { error: 'Error terminating session' }
    }

}