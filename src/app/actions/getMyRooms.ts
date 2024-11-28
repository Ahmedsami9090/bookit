'use server'
import { Room } from "@/types/types";
import { redirect } from "next/navigation";
import { createSessionClient } from "../../../config/appwrite";
import { cookies } from "next/headers";
import { Query } from "node-appwrite";

export async function getMyRooms() {
    const sessionCookies = (await cookies()).get('appwrite-session')
    if (!sessionCookies) {
        redirect('/login')
    }
    try {
        const { databases, account } = await createSessionClient(sessionCookies.value)
        const user = await account.get()
        const userId = user.$id
        const { documents } = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTIONS_ROOMS!,
            [Query.equal('user_id', userId)]
        )

        const rooms = documents as Room[]
        return rooms
    } catch (error) {
        console.log('Failed to get user rooms', error);
        redirect('/error')
    }
}