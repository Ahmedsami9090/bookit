import React from 'react'
import { getMyRooms } from '@/app/actions/getMyRooms'
import Heading from '@/components/Heading'
import MyRoomCard from '@/components/MyRoomCard'
const MyRooms = async () => {
    const rooms = await getMyRooms()

    
    return (
        <>
            <Heading title='My Rooms' />
            {rooms.length ? rooms.map((room) => <MyRoomCard key={room.$id} room={room} />)
                :
                <h3>No Rooms added by user yet.</h3>}
        </>
    )
}

export default MyRooms