import { createContext, useState, useContext, useEffect } from "react";
import supabase from "../supabase-client";

const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
// Auth functions signin, signout, logout

// Session state (user info, signin satus)
const [session, setSession] = useState("Manager is logged In");

useEffect(() => {
    async function getInitialSession() {
        try {
            const { data, error } = await supabase.auth.getSession();
            if (error) {
                throw error;
            }
            console.log(data.session);
            setSession(data.session);
        } catch (error) {
            console.error(error.message);
        }
    }
    getInitialSession();
    //2) Listen for changes in auth state (.onAuthStateChange())
    supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        console.log('Session changed:', session);
      })

}, []);

return (
    <AuthContext.Provider value={{ session }}>
        {children}
    </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
}



