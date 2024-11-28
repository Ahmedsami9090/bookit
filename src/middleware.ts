import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "./app/actions/checkAuth";

export async function middleware(request : NextRequest){
    // const {pathname} = request.nextUrl
    const {isAuth} = await checkAuth()
    if(!isAuth){
        return NextResponse.redirect(new URL('/login', request.url))
    }
    
    return NextResponse.next()
}
export const config = {
    matcher : ['/bookings']
}