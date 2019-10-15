const {Schema, model} = require('mongoose')

const pollControll = new Schema({
    title : {
        type : String,
        trim : true,
        required : true
    },
    description : {
        type : String,
        trim : true,
        required : true
    },
    totalVote : {
        type : Number
    },
    option : {
        type : [{
            type : String,
            vote : Number
        }]
    }
})

const Poll = model('Poll',pollControll);

module.exports = Poll