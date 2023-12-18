const fs = require('fs')
const path = require('path')
const express = require('express')
const routes = express.Router()
const multer = require('multer')
const uploadConfig = require('./config/upload')
const multiPartUpload = multer(uploadConfig)
const { userController, cloudFiles, llmModel } = require('./controllers')

// User
routes.post('/user', userController.addUser)

// Files S3
routes.post('/upload', multiPartUpload.single('file'), cloudFiles.upload)
routes.get('/download', cloudFiles.download)

// Chat LLM
routes.post('/chat', llmModel.chat)

module.exports = routes
