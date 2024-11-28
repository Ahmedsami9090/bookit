'use server'
import { Room } from "@/types/types";
import { redirect } from "next/navigation";
import { createAdminClient } from "../../../config/appwrite";

export async function getAllRooms() {
    try {
        const { databases } = await createAdminClient()
        const { documents } = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTIONS_ROOMS!
        )

        const rooms = documents as Room[]
        return rooms
    } catch (error) {
        console.log('Failed to show rooms', error);
        redirect('/error')
    }
}