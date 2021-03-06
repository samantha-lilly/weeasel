import axios from 'axios';

export const fetchUsers = () => {
    return axios.get(`/api/users`)
};

// export const fetchFriend = (userId) => {
//     return axios.get(`/api/users/${friendId}`)
// };

export const createFriend = (userId) => {
    return axios.post(`/api/users`, { userId })
};

export const deleteFriend = (friendId) => {
    return axios.delete(`/api/users/${friendId}`)
};

// export const joinDrawingBoard = (drawingBoardId) => {
//     return axios.post(`/api/users//drawingboards/${drawingBoardId}`)
// }

export const joinDrawingBoard = (userId, drawingBoardId) => {
    return axios.post(`/api/users/${userId}/drawingboards/${drawingBoardId}`)
}

export const leaveDrawingBoard = (drawingBoardId) => {
    return axios.delete(`/api/users/drawingboards/${drawingBoardId}`)
}