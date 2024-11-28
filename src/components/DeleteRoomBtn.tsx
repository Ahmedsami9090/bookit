'use client'
import React from 'react'
import { deleteRoom } from '@/app/actions/deleteRoom'
import { FaTrash } from 'react-icons/fa'
import { toast } from 'react-toastify'
interface PropsInterface {
    roomId: string
}
const DeleteRoomBtn = (props: PropsInterface) => {
    const { roomId } = props
    const handleDelete = async () => {
        const confirmed = window.confirm('Are you sure you want to delete this room?')
        if (confirmed) {
            try {
                const response = await deleteRoom(roomId)
                if ('success' in response) {
                    toast.success(response.success)
                }
                if ('error' in response) {
                    toast.error(response.error)
                }
            } catch (error) {
                console.log(error)
                toast.error('Error deleting room')
            }
        }
    }
    return (
        <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded mb-2 sm:mb-0 w-full sm:w-auto text-center hover:bg-red-700"
        >
            <FaTrash className='inline mr-1' /> Delete
        </button>
    )
}

export default DeleteRoomBtn