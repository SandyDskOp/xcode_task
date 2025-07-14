export const ADD_PRODUCT = "/products"
export const GET_PRODUCTS = (query)=>{
    return `/products?${query}`
}
export const UPLOAD_IMAGE = "/products/upload"
export const EDIT_PRODUCT = (id)=>{
    return `/products/${id}`
}
export const DELETE_URL = (id)=>{
    return `/products/${id}`
}