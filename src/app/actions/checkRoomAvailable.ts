'use server'
import { Booking } from "@/types/types";
import { DateTime } from "luxon";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Query } from "node-appwrite";
import { createSessionClient } from "../../../config/appwrite";

function toUTCDateTime(dateString: string) {
    return DateTime.fromISO(dateString, {
        zone: 'utc'
    }).toUTC()
}
function checkDateTimeOverlap(newCheckIn: DateTime, newCheckOut: DateTime,
    prevCheckIn: DateTime, prevCheckOut: DateTime) {
    return newCheckIn < prevCheckOut && newCheckOut > prevCheckIn
}

export async function checkRoomAvailable(roomId: string, check_in: string, check_out: string) {
    const sessionCookies = (await cookies()).get('appwrite-session')
    if (!sessionCookies) {
        redirect('/login')
    }
    try {
        const { databases } = await createSessionClient(sessionCookies.value)
        const checkInTime = toUTCDateTime(check_in)
        const checkOutTime = toUTCDateTime(check_out)
        const { documents } = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTIONS_BOOKINGS!,
            [Query.equal('room_id', roomId)]
        )
        const bookings = documents as Booking[]
        if (bookings.length == 0) {
            console.log('length is 0');
            return true
        }
            for(let booking of bookings) {
                const bookingCheckInDateTime = toUTCDateTime(booking.check_in.toString())
                const bookingCheckOutDateTime = toUTCDateTime(booking.check_out.toString())
                if (checkDateTimeOverlap(checkInTime, checkOutTime,
                    bookingCheckInDateTime, bookingCheckOutDateTime)) {
                    return false
                }
            }
            return true
        }
    catch (error) {
        console.log(error)
        return false
    }
}