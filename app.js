const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const reload = require('livereload')

const connectDB = require('./config/db')

//load config
dotenv.config({path: './config/config.env'})

// Passport config
require('./config/passport')(passport)

connectDB() 

const app = express()

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}


// Handlebars
app.engine(
    '.hbs',
    exphbs({  
      defaultLayout: 'main',
      extname: '.hbs',
    })
  )
app.set('view engine', '.hbs')


// Sessions
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
  })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Set Static
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))

const PORT = process.env.PORT || 3003

app.listen(PORT, console.log(`Server Running in ${process.env.NODE_ENV} mode on port ${PORT}`))

// reload(app)
