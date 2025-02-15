var mongoose = require('mongoose')
mongoose.connect('mongodb+srv://placement:dUVmdI40hvFvbSXN@cluster0.bdj3q.mongodb.netcareerhub/?retryWrites=true&w=majority')
.then(()=>{
    console.log("connected")

})
.catch((err)=>{
    console.log(err)
})