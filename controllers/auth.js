const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/User');
const keys = require('../config/keys')
const errorHandler = require('../utils/errorHandler')

module.exports.login = async function (req, res) {
    const candidate = await User.findOne({
        email: req.body.email
    })

    if (candidate) {
        //Проверка пароля, пользователь существует
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)

        if (passwordResult) {
            //Генерация токена, верный пароль

            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jsonwebtoken, {expiresIn: 60 * 60})

            res.status(200).json({
                token: `Bearer ${token}`
            })
        } else {
            //Неверный пароль
            res.status(401).json({
                message: 'Неверный пароль'
            })
        }
    } else {
        //Пользователя нет, нужно выдать ошибку
        res.status(404).json({
            message: 'Пользователь с таким email не найден.'
        })
    }
};

module.exports.register = async function(req, res) {
    
    
    const candidate = await User.findOne({ email: req.body.email }) 
    
    if (candidate) {
        //Пользователь существует, нужно выдать ошибку
        res.status(409).json({
            message: 'Такой Email уже занят.'
        })
    } else {
        //Пользователь не найден, нужно создать пользователя
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        })

        try {
            await user.save()  
            res.status(201).json(user)
        } catch (error) {
            errorHandler(res, error)
        }
    }
};
