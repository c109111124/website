const mongoose = require('mongoose');

const shopcartSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    lefttime: {
        type: Number,
        required: true
    },
    omurice: {
        type: Number,
        
    },
    bakedrice: {
        type: Number,
        
    },
    melaleuca: {
        type: Number,
        
    },
    pizza: {
        type: Number,
        
    },
    pasta: {
        type: Number,
        
    },
    stew: {
        type: Number,
        
    },

    omuricecombo: {
        type: Number,
        
    },
    muffin: {
        type: Number,
        
    },
    souffle: {
        type: Number,
        
    },
    cake: {
        type: Number,
        
    },
    pastacombo: {
        type: Number,
        
    },
    sundae: {
        type: Number,
        
    },

    blacktea:{
        type: Number,

    },
    american:{
        type: Number,

    },
    latte:{
        type: Number,

    },
    cappuccino:{
        type: Number,

    },
    macchiato:{
        type: Number,

    },
    hotcoco:{
        type: Number,

    },

    honeytoast:{
        type: Number,

    },
    waffledessert:{
        type: Number,

    },
    souffledessert:{
        type: Number,

    },
    frie:{
        type: Number,

    },
    eggtart:{
        type: Number,

    },
    icecream:{
        type: Number,

    },

    finish: {
        type: Boolean,
        required: true,
        default: false
    }
});

const Shopcart = mongoose.model('Shopcart', shopcartSchema);

module.exports = Shopcart;



