const mongoose = require('mongoose');
const { Schema } = mongoose;


const journalSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    entry: {
        type: String,
        required: true
    }
});

const Journal = mongoose.model('Journal', journalSchema);

module.exports = Journal;