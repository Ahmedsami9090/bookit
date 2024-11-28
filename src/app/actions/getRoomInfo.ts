'use server'
import { Room } from "@/types/types";
import { createAdminClient } from "../../../config/appwrite";
import { redirect } from "next/navigation";

export async function getRoomInfo(id: string) {
    try {
        const { databases } = await createAdminClient()
        const { documents } = await databases.getDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTIONS_ROOMS!,
            id
        )
        const rooms = documents as Room
        return rooms
    } catch (error) {
        console.log('Failed to show room', error);
        redirect('/error')
    }
}