import {
    ALL_PRODUCTS_REQUEST,
    ALL_PRODUCTS_SUCCESS,
    ALL_PRODUCTS_FAIL,
    CLEAR_ERRORS,
    PRODUCT_DETAIL_REQUEST,
    PRODUCT_DETAIL_SUCCESS,
    PRODUCT_DETAIL_FAIL,
  } from '../constants/productConstants';
  
  export const productsReducer = (state = { products: [] }, action) => {
    switch (action.type) {
      case ALL_PRODUCTS_REQUEST:
        return {
          loading: true,
          products: [],
        };
  
      case ALL_PRODUCTS_SUCCESS:
        return {
          loading: false,
          products: action.payload.products,
          productsCount: action.payload.productsCount,
        };
  
      case ALL_PRODUCTS_FAIL:
        return {
          loading: false,
          error: action.payload,
        };
      case CLEAR_ERRORS:
        return {
          ...state,
          error: null,
        };
  
      default:
        return state;
    }
  };
  
  const INITIAL_STATE = {
    product: {}, // Set initial state as an empty object or with appropriate default values
  };
  
  export const productDetailReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case PRODUCT_DETAIL_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case PRODUCT_DETAIL_SUCCESS:
        return {
          loading: false,
          product: action.payload,
        };
  
      case PRODUCT_DETAIL_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case CLEAR_ERRORS:
        return {
          ...state,
          error: null,
        };
  
      default:
        return state;
    }
  };
  