import { Router } from 'express'

import models from '../models'
import exceptions from '../exceptions'
import constants from '../utils/constants'
import bcrypt from 'bcrypt'
import validator from 'validator'
import uploadMulter from '../utils/uploadMulter'

const router = Router()

router.get('/', async (req, res) => {
    const userId = req.user.id
    const users = await models.User.findById(userId)
    return res.send(users)
})

router.put('/', async (req, res) => {
    try {
        const editUser = req.body
        let currentUser = await models.User.findById(req.user.id)

        if (editUser.email !== undefined) {
            // cambia de email
            if (editUser.email !== currentUser.email) {
                currentUser.status = constants.STATUS_UNCONFIRMED
                if (!validator.isEmail(editUser.email)) {
                    return exceptions.BadRequest(res, 'Email invalido')
                }

                const user = await models.User.find({ email: editUser.email })
                if (user.length > 0) {
                    return exceptions.BadRequest(res, 'Email está en uso')
                }
                currentUser.email = editUser.email
                currentUser.status = constants.STATUS_UNCONFIRMED
            }
        }

        if (editUser.name !== undefined) {
            currentUser.name = editUser.name
        }

        if (editUser.title !== undefined) {
            currentUser.title = editUser.title
        }

        if (editUser.photo !== undefined) {
            currentUser.photo = editUser.photo
        }

        currentUser = await currentUser.save()
        res.status(201).json(currentUser)
    } catch (err) {
        console.error(err)
        return exceptions.InternalError(res, err.message)
    }
})

router.put('/password', async (req, res) => {
    try {
        const password = req.body.password
        const newPassword = req.body.newpassword
        let currentUser = await models.User.findById(req.user.id)

        if (!bcrypt.compareSync(password, currentUser.password)) {
            return exceptions.Unauthorized(res, 'Password invalido')
        }

        currentUser.password = bcrypt.hashSync(newPassword, 11)
        await currentUser.save()
        res.status(200).json({
            status: 200,
            message: 'Password cambiado con exito',
        })
    } catch (err) {
        console.error(err)
        return exceptions.InternalError(res, err.message)
    }
})

router.put('/photo', uploadMulter.single('foto'), async (req, res) => {
    try {
        const userId = req.user.id
        let currentUser = await models.User.findById(userId)
        currentUser.photo = req.file.location
        await currentUser.save()
        res.status(200).json({
            status: 200,
            message: 'Foto cambiada con exito',
        })
    } catch (err) {
        console.error(err)
        return exceptions.InternalError(res, err.message)
    }
})

export default router
