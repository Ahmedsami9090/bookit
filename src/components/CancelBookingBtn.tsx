'use client'
import React from 'react'
import { cancelBooking } from '@/app/actions/cancelBooking'
import { toast } from 'react-toastify'
interface PropsInterface {
    bookingId: string
}
const CancelBookingBtn = (props: PropsInterface) => {
    const { bookingId } = props
    const handleBookingCancel = async () => {
        const confirmed = window.confirm('Are you sure you want to cancel this booking?')
        if (!confirmed) {
            return
        }
        const response = await cancelBooking(bookingId)
        if ('error' in response) {
            toast.error(response.error)
        }
        if ('success' in response) {
            toast.success(response.success)
        }
    }
    return (
        <button
            onClick={handleBookingCancel}
            className="bg-red-500 text-white px-4 py-2 rounded w-full sm:w-auto text-center hover:bg-red-700"
        >
            Cancel Booking
        </button>
    )
}

export default CancelBookingBtn