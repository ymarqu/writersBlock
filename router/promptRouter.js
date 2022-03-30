const express = require('express');
const Prompt = require('../models/prompts');
const router = express.Router();
const Journal = require('../models/journals');
const catchAsync = require('../utils/catchAsync');
const {journalSchema} = require('../schema');
const ExpressError = require('../utils/expressError');


const validateJournal = (req, res, next) => {
    const {error} = journalSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
} 

router.get('/', (req, res) => {
    res.render('journals/home');
})
router.get('/new', catchAsync( async(req, res) => {
    let prompt = await Prompt.aggregate([{$sample:{ size:1}}])
    prompt = prompt[0];
    res.render('journals/new', {prompt})
}));
router.get('/journal',catchAsync( async(req, res) => {
    let journal = await Journal.find({});
    res.render('journals/views', {journal});
}));
router.get('/journal/:id', catchAsync(async(req,res) => {
    const view = await Journal.findById(req.params.id);
    console.log(view);
    res.render('journals/details', {view});
}));
router.get('/journal/:id/edit', catchAsync(async(req,res) => {
   const editEntry = await Journal.findById(req.params.id);
    res.render('journals/edit', {editEntry});
}));

router.post('/', validateJournal, catchAsync( async(req, res, next) => {
   const entry = await new Journal(req.body);
   entry.save();
   res.redirect('/journals');
}));

router.delete('/journal/:id', catchAsync(async(req,res) => {
    await Journal.findByIdAndDelete(req.params.id);
    res.redirect('/journals/journal');
}));
router.patch('/journal/:id', validateJournal, catchAsync(async(req,res) => {

    await Journal.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/journals/journal/${req.params.id}`)

}));  

module.exports = router;