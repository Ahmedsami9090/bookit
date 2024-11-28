'use server'
import { redirect } from "next/navigation";
import { createSessionClient } from "../../../config/appwrite";
import { cookies } from "next/headers";
import { Query } from "node-appwrite";
import { Booking } from "@/types/types";
import { DateTime } from "luxon";

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
        }else{
            bookings.forEach(booking => {
                const bookingCheckInDateTime = toUTCDateTime(booking.check_in.toString())
                const bookingCheckOutDateTime = toUTCDateTime(booking.check_out.toString())
                if (checkDateTimeOverlap(checkInTime, checkOutTime,
                    bookingCheckInDateTime, bookingCheckOutDateTime)) {
                    console.log('false');
                    return false
                }
                console.log('true');
                return true
            })
        
    }
    catch (error) {
        return {
            error: `Failed to check for availability, ${error}`
        }
    }
}