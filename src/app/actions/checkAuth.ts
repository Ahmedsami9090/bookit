'use server'
import { User } from "@/types/types";
import { cookies } from "next/headers";
import { createSessionClient } from "../../../config/appwrite";

export async function checkAuth(): Promise<{ isAuth: boolean, user?: User }> {
    const sessionCookie = (await cookies()).get('appwrite-session')
    if (!sessionCookie) {
        return {
            isAuth: false
        }
    }
    try {
        const { account } = await createSessionClient(sessionCookie.value)
        const loggedUser = await account.get()

        return {
            isAuth: true,
            user: {
                id: loggedUser.$id,
                email: loggedUser.email,
                name: loggedUser.name
            }
        }
    } catch (error) {
        console.log(error)
        return {
            isAuth: false
        }
    }

}