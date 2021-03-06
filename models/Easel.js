const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EaselSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    drawingBoard: {
        type: Schema.Types.ObjectId,
        ref: 'DrawingBoard'
    },
    image: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        default: Date.now
    }

})

Easel = mongoose.model('Easel', EaselSchema);

module.exports = Easel;