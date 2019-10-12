import mongoose from 'mongoose'
import { Router } from 'express'

import models from '../models'
import exceptions from '../exceptions'
import validator from 'validator'
import constants from '../utils/constants'

const router = Router()

router.get('/', async (req, res) => {
    const users = await models.User.find()
    return res.send(users)
})

router.get('/:userId', async (req, res) => {
    const userId = req.params.userId

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(500).send({ message: 'Parametro invalido' })
    }

    const user = await models.User.findById(userId)
    return res.send(user)
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

export default router
