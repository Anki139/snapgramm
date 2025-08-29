import {configureStore } from "@reduxjs/toolkit"
import connectionReducer from "../features/connections/connectionSlice.js";
import userReducer from "../features/user/userSlice.js";
import messagesReducer from "../features/messages/messagesSlice.js"; 

export const store = configureStore({
    reducer:{
        user: userReducer,
        connections: connectionReducer,
        messages: messagesReducer
    }
})
