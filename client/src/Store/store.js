import { configureStore } from "@reduxjs/toolkit";
import memberReducer from './User/memberSlice.js'
import authReducer from '../Store/User/authSlice.js'
import familyReducer from '../Store/Family/familySlice.js'
import groupReducer from '../Store/Group/groupSlice.js'
export const store = configureStore({
    reducer: {
        member: memberReducer,
        auth: authReducer,
        family: familyReducer,
        group: groupReducer
    }
})