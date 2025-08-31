import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
 
const initialState={
   connection:[],
   pendingConnections:[],
   followers:[],
    following:[],
}
export const fetchConnections=createAsyncThunk('connection/fetchConnections',async(token)=>{
const {data}=await api.get('/api/user/connection',{headers:{Authorization:`Bearer ${token}`}})
return data.success ? data :null;
})

const cononectionSlice = createSlice({
    name:'connection',
    initialState,
    reducers:{}
    ,extraReducers:(builder)=>{
        builder.addCase(fetchConnections.fulfilled,(state,action)=>{
            if(action.payload){
                state.connection=action.payload.connection;
                state.pendingConnections=action.payload.pendingConnections;
                state.followers=action.payload.followers;
                state.following=action.payload.following;
            }
        })
    }

})

export default cononectionSlice.reducer;