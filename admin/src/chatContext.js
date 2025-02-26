import { createContext, useState, useEffect, useReducer } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";

export const ChatContext = createContext();

export const ChatContextProvider =({children})=>{
    
    const userdata = useSelector((state) => state.userdata);

    const INITIAL_STATE ={
        chatId:"null",
        user:[]
    }

    const chatReducer =(state,action)=>{
        switch(action.type){
            case "CHANGE_USER":
                return{
                    user: action.payload.usersID[1],
                    chatId: action.payload.chatId
                }
            default:
                return state;
        }
    }

    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE)

    return(
        <ChatContext.Provider value={{data:state , dispatch}}>
            {children}
        </ChatContext.Provider>
    )
}