import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../Store/User/userSlice.js'
import authReducer from '../Store/User/authSlice.js'
import familyReducer from '../Store/Family/familySlice.js'
import groupReducer from '../Store/Group/groupSlice.js'
export const store = configureStore({
    reducer: {
        user: userReducer,
        auth: authReducer,
        family: familyReducer,
        group: groupReducer
    }
})