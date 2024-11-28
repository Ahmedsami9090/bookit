'use server'
import { createAdminClient } from "../../../config/appwrite"
import { cookies } from "next/headers"
export async function createSession(prevData: { error: string } | { success: string } | null | undefined, formData: FormData) {
    const email = formData.get('email')?.toString()
    const password = formData.get('password')?.toString()
    const { account } = await createAdminClient()
    try {
        const session = await account.createEmailPasswordSession(email!, password!)
            ; (await cookies()).set('appwrite-session', session.secret, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                expires: new Date(session.expire),
                path: '/'
            })
        return { success: 'Logged in successfully' }
    } catch (error) {
        console.log(error);
        return { error: 'Please Enter valid Credentials' }
    }
}