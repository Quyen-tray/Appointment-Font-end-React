import {createContext, useContext, useState, useEffect, useCallback} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(null);
    const [patientId, setPatientId] = useState(null); 
    const [load, setLoad] = useState(!!token);

    const fetchUser = useCallback(async () => {
        if (token) {
            try {
                const res = await fetch("http://localhost:8081/api/user/me", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                    setIsLoggedIn(true);
                    setPatientId(data.id); 
                    console.log(data);
                } else if (res.status === 401) {
                    localStorage.removeItem("token");
                    setToken(null);
                    setIsLoggedIn(false);
                    setUser(null);
                    setPatientId(null); 
                    console.error("Token hết hạn, auto logout");
                } else {
                    console.error(res);
                }

            } catch (err) {
                console.error("Lỗi khi lấy user:", err);
            } finally {
                setLoad(false);
            }
        } else {
            setLoad(false);
        }
    },[token]);

    useEffect(() => {
        if (token) {
            fetchUser();
        }else{
            setLoad(false);
        }
    }, [fetchUser, token]);


    const login = async (username, password) => {
        try {
            const response = await fetch("http://localhost:8081/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.status === 200 && data.token) {
                localStorage.setItem('token', data.token);
                setToken(data.token);
                setLoad(true);
                setIsLoggedIn(true);
                return { success: true };
            } else {
                return { success: false, message: data.message + " login failed" };
            }
        } catch (error) {
            console.log(error);
            return { success: false, message: "Server error: " + error.message };
        }
    };


    const logout = async () => {
        try {
            const res = await fetch("http://localhost:8081/api/auth/logout", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.status !== 200) {
                throw new Error("Logout failed on server");
            }else{
                localStorage.removeItem("token");
                setUser(null);
                setIsLoggedIn(false);
                return { success: true };
            }


        } catch (error) {
            console.error("❌ Logout error:", error);
            return { success: false, message: error.message };
        }
    }

    return (
        <AuthContext.Provider value={{login,logout,isLoggedIn,token,user,setToken,setUser,load,setLoad}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);