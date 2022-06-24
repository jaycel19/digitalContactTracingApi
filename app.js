const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const jsonParser = bodyParser.json();



app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

mongoose.connect("mongodb+srv://jcl20:gYD72UUQavipuptf@cluster0.hocpu.mongodb.net/digitalContractTracingDB", {useNewUrlParser: true})

//DATABASE SCHEMAS

const customTimeSchema = {
    hour: String,
    min: String,
    sec: String
}

const adminAccountSchema = {
    username: String,
    password: String
}

const contactDataSchema = {
    fullName: String,
    address: String,
    contactNum: String,
    
    dateIn: {
        type: String,
        default: `${new Date().getDay()}-${new Date().getMonth()}-${new Date().getFullYear()}`
    },
}

// const dailyRecordSchema = {
//     dateOfEntry: {
//         type: Date,
//         default: new Date()
//     },
//     visitors: []
// }

const visitorUserSchema = {
    email: String,
    password: String
}

const securityPersonnelSchema = {
    fullName: String,
    address: String,
    contact: String,
    email: String,
    password: String
}

const ContactData = mongoose.model("ContactData", contactDataSchema);
//const DailyRecord = mongoose.model("DailyRecord", dailyRecordSchema);
const CustomTime = mongoose.model("CustomTime", customTimeSchema);
const VisitorUser = mongoose.model("VisitorUser", visitorUserSchema);
const SecurityPersonnel = mongoose.model("SecurityPersonnel", securityPersonnelSchema);
const AdminAccount = mongoose.model("AdminAccount", adminAccountSchema);



app.route("/visitor/login")
.post(jsonParser, (req, res)=>{
    const wrongPass = {
        pass: {
            isLogged: false,
            msg: "Wrong password! Try again."
        }
    };
    const emailNotFound = {
        email: {
            isLogged: false,
            msg: "Email not found! Try again."
        }
    }
    const logged = {
        logged: {
            isLogged: true
        }
        
    }
    VisitorUser.findOne({email: req.body.email}, (err, foundVisitorUser)=>{
        if(err){
            res.send(err);
        }else{
            if(foundVisitorUser){
                if(foundVisitorUser.password === req.body.password){
                    res.send(true);
                }else{
                    res.send(false);
                }
            }else{
                res.send(false);
            }
        }
    })
})

app.route("/visitor/signup")
.post(jsonParser, (req, res)=>{
    VisitorUser.findOne({email: req.body.email}, (err, foundVisitorUser)=>{
        if(err){
            res.send(err);
        }else{
            if(!foundVisitorUser){
                const newVisitorUser = new VisitorUser({
                    email: req.body.email,
                    password: req.body.password
                })
                newVisitorUser.save();
                res.send(true);
            }else{
                res.send(false);
            }
        }
    })
});

app.route("/personnel/security/login")
.post(jsonParser, (req, res)=>{
    SecurityPersonnel.findOne({email: req.body.email}, (err, foundSecurityPersonnel)=>{
        if(err){
            res.send(err);
        }else{
            if(foundSecurityPersonnel){
                if(foundSecurityPersonnel.password === req.body.password){
                    res.send(true);
                }else{
                    res.send(false);
                }
            }else{
                res.send(false);
            }
        }
    })
})

app.route("/personnel/security/signup")
.post(jsonParser, (req, res)=>{
    SecurityPersonnel.findOne({email: req.body.email}, (err, foundSecurityPersonnel)=>{
        if(err){
            res.send(err);
        }else{
            if(!foundSecurityPersonnel){
                const newSecurityUser = new SecurityPersonnel({
                    fullName: req.body.fullName,
                    address: req.body.address,
                    contact: req.body.contact,
                    email: req.body.email,
                    password: req.body.password
                })
                newSecurityUser.save();
                res.send(true);
            }else{
                res.send(false);
            }
        }
    })
});

app.route("/personnel/security/addrecord")
.post(jsonParser, (req, res)=>{
    const newContactData = new ContactData(req.body)
    newContactData.save();
    res.send(true);
})


app.route("/personnel/admin/getAll/:dateNow")
.get((req, res)=>{
    const dateNow = new Date();
    const newDay = dateNow.getDay();
    const newMonth = dateNow.getMonth();
    const newYear = dateNow.getFullYear();
    const dateStart = new Date(req.params.dateNow);
    const dateR = new Date(newYear, newMonth, (newDay + 2));
    ContactData.find({dateIn: {
        "$gte": dateStart, "$lte": dateR
    }}, (err, foundResults)=>{
        if(err){
            res.send(err);
        }else{
            res.send(foundResults);
        }
    });
});

app.route("/personnel/admin/getAll")
.get((req, res)=>{
    
    ContactData.find((err, foundResults)=>{
        if(err){
            res.send(err);
        }else{
            res.send(foundResults);
        }
    });
});

app.route("/personnel/admin/reviewbydate/:from/:to")
.get((req, res)=>{
    DailyRecord.find({dateOfEntry:{
        "$gte": new Date(req.params.from), "$lte": new Date(req.params.to)
    }}, (err, foundResults)=>{
        if(err){
            res.send(err);
        }else{
            res.send(foundResults);
        }
    });
});

app.route("/admin/register")
.post(jsonParser, (req, res)=>{
    AdminAccount.findOne({username: req.body.username}, (err, foundAdminAccount)=>{
        if(err){
            res.send(err);
        }else{
            if(!foundAdminAccount){
                const newAdminAccount = new AdminAccount({
                    username: req.body.username,
                    password: req.body.password
                })
                newAdminAccount.save();
                res.send(true);
            }else{
                res.send(false);
            }
        }
    })
});

app.route("/admin/login")
.post(jsonParser, (req, res)=>{
    AdminAccount.findOne({username: req.body.username}, (err, foundAdminAccount)=>{
        if(err){
            res.send(err);
        }else{
            if(foundAdminAccount){
                if(foundAdminAccount.password === req.body.password){
                    res.send(true);
                }else{
                    res.send(false);
                }
            }else{
                res.send(false);
            }
        }
    })
})

const PORT = process.env.PORT || 5000;


app.listen(PORT, ()=>{
    console.log("Server open on port 3001")
})