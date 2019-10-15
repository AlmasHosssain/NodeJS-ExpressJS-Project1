const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')

const app = express()
app.set('view engine','ejs')

app.use(morgan('dev'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
const {Schema, model} = require('mongoose')

const pollSchema = new Schema({
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
        type : Number,
        default : 0
    },
    option : {
        type : [{
            type : String,
            vote : Number
        }]
    }
})

const Poll = model('Poll',pollSchema);

app.get('/create',(req,res,next)=>{
    res.render('create')
})

app.post('/create',(req,res,next)=>{
    let {title,description,option} = req.body
    option = option.map((nm)=>{
        return {
            name : nm,
            vote : 0
        }
    })
    let poll = new Poll({
        title,
        description,
        option
    })

    try {
        poll.save()
        res.redirect('/polls')
    } catch (error) {
        console.log(error);
        
    }
    
})

app.get('/polls',async(req,res,next)=>{
    try {
        let polls = await Poll.find()
        res.render('poll',{polls})
    } catch (error) {
        console.log(error);
        
    }
})

app.get('/polls/:id',async(req,res,next)=>{
    try {

        let id = req.params.id;
        let polls = await Poll.findById(id)
        let option = [...polls.option]
        let result = []
        
        option.forEach((option)=>{
            let percentage = (option.vote*100) / polls.totalVote;
            result.push({
                ...option._doc,
                percentage : percentage? percentage : 0
            }) 
        })
        res.render(viewPoll,{polls,result})

    } catch (error) {
        console.log(error);
        
    }
})

app.post('/polls/:id', async(req,res,next)=>{
    let id = req.params.id;
    let optionId = req.body.option

    try {
        let poll = await Poll.findById(id)
        let option = [...poll.option]
        let index = option.findIndex(o=>o.id == optionId)

        option[index].vote = option[index].vote + 1
        let totalVote = poll.totalVote + 1

        await Poll.findOneAndUpdate(
            {_id: poll._id},
            {$set : {option,totalVote}}
        )
        res.redirect('/polls/'+id)
    } catch (error) {
        console.log(error);
        
    }

})

app.get('/',(req,res,next)=>{
    res.render('home')
})
mongoose.connect('mongodb://localhost/testSchema')
        .then(()=>{
            app.listen(4545,()=>{
                console.log("Application is ready to serve");
                
            })
        })
        .catch((error)=>{
            console.log(error);
            
        })
        
    const db = mongoose.connection;
    db.on('error',(error)=>{
            console.log(error);            
        })
        db.once('open',()=>{
            console.log("Database has been stablished");
            
        })
