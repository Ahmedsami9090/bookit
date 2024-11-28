import { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from "react";
import { checkAuth } from "@/app/actions/checkAuth";
import { User } from "@/types/types";
interface AuthProviderProps {
    children: ReactNode
}
type CreateContextType = {
    isAuthenticated: boolean | null;
    userData: User | null;
    setIsAuthenticated : Dispatch<SetStateAction<boolean | null>>;
    setUserData : Dispatch<SetStateAction<User | null>>}
    | null
export const AuthContext = createContext<CreateContextType>(null)

export default function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
    const [userData, setUserData] = useState<User | null>(null)
    useEffect(() => {
        const getAuthStatus = async () => {
            const result = await checkAuth()
            setIsAuthenticated(result.isAuth)
            result.isAuth && (setUserData(result.user!))
            console.log(userData, isAuthenticated);

        }
        getAuthStatus()
    }, [])

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            setIsAuthenticated,
            userData,
            setUserData
        }}>
        { children }
        </AuthContext.Provider>
    )
}

export const useAuth = ()=> {
    const context = useContext(AuthContext)
    if (!context){
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
