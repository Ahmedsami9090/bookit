'use server'
import { Booking } from "@/types/types";
import { redirect } from "next/navigation";
import { createSessionClient } from "../../../config/appwrite";
import { cookies } from "next/headers";
import { Query } from "node-appwrite";
import { checkAuth } from "./checkAuth";

export async function getMyBookings() {
    const sessionCookies = (await cookies()).get('appwrite-session')
    if (!sessionCookies) {
        redirect('/login')
    }
    const { user } = await checkAuth()
    try {
        const { databases } = await createSessionClient(sessionCookies.value)
        const { documents } = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTIONS_BOOKINGS!,
            [Query.equal('user_id', user!.id)]
        )
        const bookings = documents as Booking[]
        return bookings
    } catch (error) {
        console.log('Failed to get user bookings', error);
    }
}