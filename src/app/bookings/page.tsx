import React from 'react'
import { getMyBookings } from '../actions/getMyBookings'
import Heading from '@/components/Heading'
import BookingCard from '@/components/BookingCard'
const Bookings = async () => {
  const bookings = await getMyBookings()
  return (
    <>
      <Heading title='My Bookings' />
      {bookings?.length ?
        bookings.map((booking) => <BookingCard key={booking.$id} booking={booking} />
          )
        :
        <h3>No bookings yet</h3>}
    </>
  )
}
export default Bookings