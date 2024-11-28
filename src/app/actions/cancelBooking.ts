'use server'
import { redirect } from "next/navigation";
import { createSessionClient } from "../../../config/appwrite";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function cancelBooking(bookingId: string) {
    const sessionCookies = (await cookies()).get('appwrite-session')
    if (!sessionCookies) {
        redirect('/login')
    }
    try {
        const { databases } = await createSessionClient(sessionCookies.value)
        await databases.getDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE || '',
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTIONS_BOOKINGS || '',
            bookingId,
        )
        await databases.deleteDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE || '',
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTIONS_BOOKINGS || '',
            bookingId
        )
        revalidatePath('/bookings', 'layout')
        return {
            success: 'Booking deleted successfully'
        }
    } catch (error) {
        return {
            error: `Error cancelling the booking, ${error}`
        }
    }
}