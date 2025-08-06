import { createContext, useState, useContext, useEffect } from "react";
import supabase from "../supabase-client";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
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
      console.log("Session changed:", session);
    });
  }, []);

  //Auth functions (signin, signup, logout)
  //Sign in (success, data, error)

  const signInUser = async (email, password) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.toLowerCase(),
            password: password,
        })
        //handle supabase error explicitly
      if (error) {
        console.error('Supabase sign-in error:', error.message);
        return { success: false, error: error.message};
      }
      console.log('Supabase sign-in success:', data);
      return { success: true, data };
    } catch (error) {
        //Unexpected error
      console.error('Unexpected error during sign-in:', error.message);
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  };


  const signOut = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('Supabase sign-out error:', error.message);
          return { success: false, error: error.message };
        }
        return { success: true };
    } catch (error) {
      console.error('Unexpected error during sign-out:', error.message);
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  }


  return (
    <AuthContext.Provider value={{ session, signInUser, signOut}}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
