import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        username: localStorage.getItem("username"),
        email: localStorage.getItem("email"),
        location: localStorage.getItem("location"),
    });

    const updateUser = (updatedFields) => {
        const updatedUser = { ...user, ...updatedFields };
        setUser(updatedUser);
        Object.keys(updatedFields).forEach((field) => {
            localStorage.setItem(field, updatedFields[field]);
        });
    };

    return (
        <UserContext.Provider value={{ user, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
