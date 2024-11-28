'use server'
import { createAdminClient } from "../../../config/appwrite";
import { ID } from "node-appwrite";

export async function createUser(prevData: { error: string } | { success: string } | null | undefined, formData: FormData) {
    const email = formData.get('email')?.toString()
    const name = formData.get('name')?.toString()
    const password = formData.get('password')?.toString()
    const rePassword = formData.get('confirm-password')?.toString()
    if (password!.length < 8) {
        return {
            error: 'Password should be at least 8 characters long.'
        }
    }
    if (password !== rePassword) {
        return {
            error: 'Password do not match'
        }
    }
    try {
        const { account } = await createAdminClient()
        await account.create(ID.unique(), email!, password!, name)
        return {
            success: 'User created Successfully'
        }
    } catch (error) {

        return {
            error: `Could not register user, ${error}`
        }
    }
}