import { Booking } from '@/types/types'
import Link from 'next/link'
import React from 'react'
import CancelBookingBtn from './CancelBookingBtn'
interface PropsInterface {
    booking: Booking
}
const BookingCard = (props: PropsInterface) => {
    const { booking } = props
    const { room_id } = booking
    const formatDate = (dateString: Date) => {
        const date = new Date(dateString)
        const month = date.toLocaleString('en-US', {
            month: 'short',
            timeZone: 'UTC'
        })
        const day = date.getUTCDate();
        const time = date.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone: 'UTC'
        })
        return `${month} ${day} at ${time}`
    }
    return (
        <div
            className="bg-white shadow rounded-lg p-4 mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center"
        >
            <div>
                <h4 className="text-lg font-semibold">{room_id.name}</h4>
                <p className="text-sm text-gray-600">
                    <strong>Check In:</strong> {formatDate(booking.check_in)}
                </p>
                <p className="text-sm text-gray-600">
                    <strong>Check Out:</strong> {formatDate(booking.check_out)}
                </p>
            </div>
            <div
                className="flex flex-col sm:flex-row w-full sm:w-auto sm:space-x-2 mt-2 sm:mt-0"
            >
                <Link
                    href={`/rooms/${room_id.$id}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded mb-2 sm:mb-0 w-full sm:w-auto text-center hover:bg-blue-700"
                >
                    View Room
                </Link>
                <CancelBookingBtn bookingId={booking.$id} />
            </div>
        </div>
    )
}

export default BookingCard