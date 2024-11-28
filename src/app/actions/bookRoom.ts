'use server'
import { redirect } from "next/navigation";
import { createSessionClient } from "../../../config/appwrite";
import { cookies } from "next/headers";
import { ID } from "node-appwrite";
import { checkAuth } from "./checkAuth";
import { revalidatePath } from "next/cache";
import { checkRoomAvailable } from "./checkRoomAvailable";

export async function bookRoom(prevData: { error: string } | { success: string } | null | undefined, formData: FormData) {
    const sessionCookies = (await cookies()).get('appwrite-session')
    if(!sessionCookies){
        redirect('/login')
    }
    try {
        const { databases } = await createSessionClient(sessionCookies.value)
        const {user} = await checkAuth()
        if(!user){
            return {
                error : 'Please log in first'
            }
        }
        const checkInDate = formData.get('check_in_date')
        const checkInTime = formData.get('check_in_time')
        const checkOutDate = formData.get('check_out_date')
        const checkOutTime = formData.get('check_out_time')
        const roomId = formData.get('room_id') || ''
        const checkInCombine  =`${checkInDate}T${checkInTime}`
        const checkOutCombine  =`${checkOutDate}T${checkOutTime}`
        const isAvailable = await checkRoomAvailable(roomId.toString(),checkInCombine,checkOutCombine)
        console.log('is available', isAvailable);
        if (!isAvailable){
            console.log('is available xx', isAvailable);
            return {
                error : 'This room is already booked for the selected time'
            }
        }
        const bookingData = {
            check_in : checkInCombine,
            check_out : checkOutCombine,
            user_id : user.id,
            room_id :roomId
        }
        await databases.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE || '',
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTIONS_BOOKINGS || '',
            ID.unique(),
            bookingData
        )
        revalidatePath('/bookings', 'layout')
        return {
            success : 'Room booked successfully'
        }
    } catch (error) {
        
        return {
            error : `unexpected error occurred, ${error}`
        }
    }
}