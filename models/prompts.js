const mongoose = require('mongoose');
const { Schema } = mongoose;

const promptSchema = new Schema({
    prompt: String, 
    category: String
});


const Prompt = mongoose.model('Prompt', promptSchema);

module.exports = Prompt;
