'use server'
import { Room } from "@/types/types";
import { redirect } from "next/navigation";
import { createSessionClient } from "../../../config/appwrite";
import { cookies } from "next/headers";
import { Query } from "node-appwrite";
import { revalidatePath } from "next/cache";

export async function deleteRoom(roomId: string): Promise<{ success: string } | { error: string }> {

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
        const roomToDelete = rooms.find((room) => room.$id == roomId)
        if (roomToDelete) {
            await databases.deleteDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
                process.env.NEXT_PUBLIC_APPWRITE_COLLECTIONS_ROOMS!,
                roomToDelete.$id
            )
            revalidatePath('/rooms/my-rooms', 'layout')
            revalidatePath('/', 'layout')

            return {
                success: 'Room deleted successfully'
            }
        } else {
            return {
                error: 'Failed to delete Room'
            }
        }

    } catch (error) {
        return {
            error: `Failed to delete Room ${error}`
        }
    }
}