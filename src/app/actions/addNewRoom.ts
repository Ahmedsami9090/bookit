'use server'
import { revalidatePath } from "next/cache"
import { ID } from "node-appwrite"
import { createAdminClient } from "../../../config/appwrite"
import { checkAuth } from "./checkAuth"

export async function addNewRoom(prevState: { error: string } | { success: string } | null | undefined, formData: FormData) {
    const { databases, storage } = await createAdminClient()
    try {
        const {user} = await checkAuth()
        if(!user){
            return {
                error : 'please log in first'
            }
        }
        let imageID;
        const image = formData.get('image') as File || 'no-image.svg'
        if(image){
            try {
                const response = await storage.createFile(
                    process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ROOMS!,
                    ID.unique(),
                    image
                )
                imageID = response.$id
            } catch (error) {
                
                return{
                    error : `Error uploading image, ${error}`
                }
            }
        }else {
            return {
                error : "No image is added or error uploading image"
            }
        }
        const name = formData.get('name')
        const description= formData.get('description')
        const address = formData.get('address')
        const location = formData.get('location')
        const availability = formData.get('availability')
        const amenities = formData.get('amenities')

        await databases.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE || '',
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTIONS_ROOMS || '',
            ID.unique(),
            {
                user_id: user.id,
                name: name,
                description: description,
                sqft: Number(formData.get('sqft')),
                capacity: Number(formData.get('capacity')),
                price_per_hour: Number(formData.get('price_per_hour')),
                address: address,
                location: location,
                availability: availability,
                amenities: amenities,
                image : imageID
            }
        )
        revalidatePath('/', 'layout')
        return {
            success: 'Room added successfully'
        }
    } catch (error) {
        return {
            error: `Error adding new room ${error}`
        }
    }
}