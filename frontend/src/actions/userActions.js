import axios from 'axios'
import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAIL,
    UPDATE_PASSWORD_REQUEST,
    UPDATE_PASSWORD_SUCCESS,
    UPDATE_PASSWORD_FAIL,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAIL,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL,
    CLEAR_ERRORS
} from '../constants/userConstants'


export const login = (email, password) => async(dispatch) => {
    try{
        dispatch({type: LOGIN_REQUEST})

        const config = {
            headers: {
                'Content-type' : 'application/json'
            }
        }

        const {data} = await axios.post(`/api/v1/login`, {email, password}, config)

        dispatch({
            type:LOGIN_SUCCESS,
            payload:data.user
        })

    } catch(error){
        dispatch({
            type:LOGIN_FAIL,
            payload:error.response.data.message
        })
    }
}

//register user



export const register = (name, email, password) => async(dispatch) => {
    try{

        console.log(name, "name");
        dispatch({type: REGISTER_USER_REQUEST})

        const config = {
            headers: {
                'Content-type' : 'application/json'
            }
        }

        const {data} = await axios.post(`/api/v1/register`, {name, email, password}, config)

        dispatch({
            type:REGISTER_USER_SUCCESS,
            payload:data.user
        })

    } catch(error){
        dispatch({
            type:REGISTER_USER_FAIL,
            payload:error.response.data.message
        })
    }
}



//LOAD USER

export const loadUser = () => async(dispatch) => {
    try{

        // console.log(name, "name");
        dispatch({type: LOAD_USER_REQUEST})


        const {data} = await axios.get(`/api/v1/me`)

        dispatch({
            type:LOAD_USER_SUCCESS,
            payload:data.user
        })

    } catch(error){
        dispatch({
            type:LOAD_USER_FAIL,
            payload:error.response.data.message
        })
    }
}




//Logout USER

export const logout = () => async(dispatch) => {
    try{


        await axios.get(`/api/v1/logout`)

        dispatch({
            type:LOGOUT_SUCCESS,
        })

    } catch(error){
        dispatch({
            type:LOGOUT_FAIL,
            payload:error.response.data.message
        })
    }
}




//update profile



export const updateProfile = (name, email, password) => async(dispatch) => {
    try{

        // console.log(name, "name");
        dispatch({type: UPDATE_PROFILE_REQUEST})

        const config = {
            headers: {
                'Content-type' : 'application/json'
            }
        }

        const {data} = await axios.put(`/api/v1/me/update`, {name, email, password}, config)

        dispatch({
            type:UPDATE_PROFILE_SUCCESS,
            payload:data.success
        })

    } catch(error){
        dispatch({
            type:UPDATE_PROFILE_FAIL,
            payload:error.response.data.message
        })
    }
}


//UPDATE PASSWORD


export const updatePassword = (oldPassword, password) => async(dispatch) => {
    try{

        // console.log(name, "name");
        dispatch({type: UPDATE_PASSWORD_REQUEST})

        const config = {
            headers: {
                'Content-type' : 'application/json'
            }
        }

        const {data} = await axios.put(`/api/v1/password/update`, {oldPassword, password}, config)

        dispatch({
            type:UPDATE_PASSWORD_SUCCESS,
            payload:data.success
        })

    } catch(error){
        dispatch({
            type:UPDATE_PASSWORD_FAIL,
            payload:error.response.data.message
        })
    }
}



//Forgot Password


export const forgotPassword = (email) => async(dispatch) => {
    try{

        console.log(email);
        dispatch({type: FORGOT_PASSWORD_REQUEST})

        const config = {
            headers: {
                'Content-type' : 'application/json'
            }
        }

        const {data} = await axios.post(`/api/v1/password/forgot`, {email}, config)

        console.log(data);

        dispatch({
            type:FORGOT_PASSWORD_SUCCESS,
            payload:data.message
        })

    } catch(error){
        dispatch({
            type:FORGOT_PASSWORD_FAIL,
            payload:error.response.data.message
        })
    }
}




export const clearErrors = () => async (dispatch) => {
    dispatch({
        type:CLEAR_ERRORS
    })
}