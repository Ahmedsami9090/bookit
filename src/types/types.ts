import { Models } from "node-appwrite";

export interface Room extends Models.Document {
    user_id: string,
    name: string,
    description: string,
    sqft: number,
    capacity: number,
    location: string,
    address: string,
    amenities: string,
    availability: string,
    price_per_hour: number,
    image?: string
}
export interface User {
    id: string
    name: string
    email: string
}
export interface Booking extends Models.Document {
    user_id: string
    room_id: Room
    check_in: Date
    check_out: Date
}