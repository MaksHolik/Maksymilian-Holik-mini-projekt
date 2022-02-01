const { table } = require("console");
var express = require("express");
var app = express();
const PORT = process.env.PORT || 3000;
var hbs = require('express-handlebars');
var path = require("path");
var if_logged = false;
var tab = [{ id: 0, username: 'admin', password: 'admin', age: 18, gender: 'M', student: false }];
var index = 3;
var asc = false;

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'hbs');

app.get("/", function (req, res) {
    res.render('main.hbs');
})

app.get("/register", function (req, res) {
    res.render('register.hbs');
})

app.get("/login", function (req, res) {
    res.render('login.hbs');
})

app.get("/sort", function (req, res) {
    if (!if_logged) {
        res.render('not_admin.hbs', { layout: "not_admin.hbs" });
    }
    else {
        var tab1 = [...tab.sort((a, b) => {
            if (asc)
                return a.age - b.age
            return b.age - a.age
        })]
        res.render('sort.hbs', { layout: "admin.hbs", tab1, asc, desc: !asc });
    }
})
app.get("/asc", function (req, res) {
    if (!if_logged) {
        res.render('not_admin.hbs', { layout: "not_admin.hbs" });
    }
    else {
        if (req.query.sort == "asc") {
            asc = true;
        }
        else if (req.query.sort == "desc")
            asc = false;
    }
    res.redirect("/sort")
})
app.get("/gender", function (req, res) {
    if (!if_logged) {
        res.render('not_admin.hbs', { layout: "not_admin.hbs" });
    }
    else {
        var men = [...tab.filter(user => user.gender == "M")]
        var women = [...tab.filter(user => user.gender == "K")]
        res.render('gender.hbs', { layout: "admin.hbs", men, women });
    }

})

app.get("/show", function (req, res) {
    if (!if_logged) {
        res.render('not_admin.hbs', { layout: "not_admin.hbs" });
    }
    else {
        res.render('show.hbs', { layout: "admin.hbs", tab });
    }

})

app.get("/logout", function (req, res) {
    if_logged = false;
    res.render('main.hbs');
})

app.post("/login", function (req, res) {
    console.log(tab, req.body)
    tab.forEach(function (user) {
        if (user.username == req.body.login && user.password == req.body.password) {
            if_logged = true;
            return res.redirect('/admin');
        }
    })
    if (!if_logged) res.send("<b>NIE MA TAKIEGO UŻYTKOWNIKA</b>")
})

app.post("/register", function (req, res) {
    if (
        !req.body.login || !req.body.password || !req.body.age || !req.body.gender ||
        typeof req.body.login !== "string" ||
        typeof req.body.password !== "string" ||
        req.body.login.length < 3 || req.body.login.length > 30 ||
        req.body.password.length < 3 || req.body.password.length > 30 ||
        (req.body.gender !== "K" && req.body.gender !== "M") ||
        req.body.age < 10 || req.body.age > 125 || isNaN(req.body.age) ||
        tab.some(user => user.username == req.body.username)
    ) {
        return res.redirect('/register');
    }
    else {
        tab.push({
            id: index++,
            username: req.body.login,
            password: req.body.password,
            age: Number(req.body.age),
            student: req.body.student,
            gender: req.body.gender,
        });
        res.send("<b>Utworzono użytkownika</b><p><a href='/login'>przejdź do logowania</a></p>")
    }

})

app.get("/admin", function (req, res) {
    if (!if_logged) {
        res.render('not_admin.hbs', { layout: "not_admin.hbs" });
    }
    else
        res.render('admin.hbs', { layout: "admin.hbs" });
})

app.use(express.static('static'));
app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})