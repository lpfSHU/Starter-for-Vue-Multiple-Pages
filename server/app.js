var createError = require('http-errors')
var express = require('express')
var path = require('path');
var cookieParser = require('cookie-parser')
var logger = require('morgan')

var indexRouter = require('./routes/index')
var apiRouter = require('./routes/api')

var app = express()


app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

const pathReg = /\/$/
app.use((req, res, next) => {
	if(req.url.length > 1){
		req.url = req.url.replace(pathReg, '')
	}
	next()
})

app.use('/public', express.static(path.join(__dirname, 'public'), {
	extensions: ['html']
}));


app.use('/', indexRouter)
app.use('/api', apiRouter)



// catch 404 and forward to error handler
const frReg = /\/fr.*$/
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  console.log('error')
  res.status(err.status || 500)
  res.json(res.locals)
});

module.exports = app
