const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DrawingBoardSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    easels: [{
        type: Schema.Types.ObjectId,
        ref: 'Easel'
    }],
    comments: [
    {
        username: { type: String },
        text: { type: String },
        createdAt: { type: Date, default: Date.now }
    }
]
})

DrawingBoard = mongoose.model('DrawingBoard', DrawingBoardSchema);

module.exports = DrawingBoard;