import { Router } from 'express'
import exceptions from '../../exceptions'
import models from '../../models'
import validator from 'validator'
import bcrypt from 'bcrypt'
import constant from '../../utils/constants'

const router = Router()

router.post('/', async (req, res) => {
    try {
        const newUser = new models.User(req.body)

        newUser.username = newUser.username.toLowerCase()
        newUser.email = newUser.email.toLowerCase()

        if (!validator.isEmail(newUser.email)) {
            return exceptions.BadRequest(res, 'Email invalido')
        }

        if (!validator.isAlphanumeric(newUser.username, 'en-US')) {
            return exceptions.BadRequest(
                res,
                'Usuario no puede contener caracteres especiales'
            )
        }

        let user = await models.User.find({ username: newUser.username })
        if (user.length > 0) {
            return exceptions.BadRequest(res, 'Usuario está en uso')
        }

        user = await models.User.find({ email: newUser.email })
        if (user.length > 0) {
            return exceptions.BadRequest(res, 'Email está en uso')
        }

        newUser.password = bcrypt.hashSync(newUser.password, 11)
        newUser.status = constant.STATUS_UNCONFIRMED
        newUser.role = constant.ROLE_USER

        await newUser.save()

        return res.status(201).json({ 
            status: 201, 
            message: 'Usuario creado con exito',
        })
    } catch (err) {
        console.error(err)
        return exceptions.InternalError(res, err.message)
    }
})

export default router
