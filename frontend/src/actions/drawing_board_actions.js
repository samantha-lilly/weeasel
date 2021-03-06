import * as DrawingBoardApiUtil from '../util/drawing_board_api_util';

export const RECEIVE_ALL_DRAWING_BOARDS = 'RECEIVE_ALL_DRAWING_BOARDS'
export const RECEIVE_DRAWING_BOARDS = "RECEIVE_DRAWING_BOARDS"
export const RECEIVE_DRAWING_BOARD = "RECEIVE_DRAWING_BOARD"
export const REMOVE_DRAWING_BOARD = "REMOVE_DRAWING_BOARD"
export const RECEIVE_COMMENT = 'RECEIVE_COMMENT'

const receiveDrawingBoards = (drawingBoards) => ({
    type: RECEIVE_DRAWING_BOARDS,
    drawingBoards
})

const receiveAllDrawingBoards = (allDrawingBoards) => ({
    type: RECEIVE_ALL_DRAWING_BOARDS,
    allDrawingBoards
})

const receiveDrawingBoard = (drawingBoard) => ({
    type: RECEIVE_DRAWING_BOARD,
    drawingBoard
})

const removeDrawingBoard = (drawingBoardId) => ({
    type: REMOVE_DRAWING_BOARD,
    drawingBoardId
})

const receiveComment = (comment) => ({
    type: RECEIVE_COMMENT,
    comment
})

export const fetchDrawingBoards = () => (dispatch) => (
    DrawingBoardApiUtil.fetchDrawingBoards()
        .then(drawingBoards => dispatch(receiveDrawingBoards(drawingBoards)))
)

export const fetchDrawingBoard = (drawingBoardId) => (dispatch) => (
    DrawingBoardApiUtil.fetchDrawingBoard(drawingBoardId)
        .then(drawingBoard => dispatch(receiveDrawingBoard(drawingBoard)))
)

export const createDrawingBoard = (drawingBoard) => (dispatch) => (
    DrawingBoardApiUtil.createDrawingBoard(drawingBoard)
        .then(drawingBoard => dispatch(receiveDrawingBoard(drawingBoard)))
)

export const updateDrawingBoard = (drawingBoard) => (dispatch) => (
    DrawingBoardApiUtil.updateDrawingBoard(drawingBoard)
        .then(drawingBoard => dispatch(receiveDrawingBoard(drawingBoard)))
)

export const deleteDrawingBoard = (drawingBoardId) => (dispatch) => (
    DrawingBoardApiUtil.deleteDrawingBoard(drawingBoardId)
        .then(() => dispatch(removeDrawingBoard(drawingBoardId)))
)

export const addComment = (drawingBoardsId, comment) => dispatch => (
    DrawingBoardApiUtil.addComment(drawingBoardsId, comment)
        .then(comment => dispatch(receiveComment(comment)))
)

export const fetchAllDrawingBoards = () => (dispatch) => (
    DrawingBoardApiUtil.fetchAllDrawingBoards()
        .then(drawingBoards => dispatch(receiveAllDrawingBoards(drawingBoards)))
)