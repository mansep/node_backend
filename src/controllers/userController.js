import mongoose from 'mongoose'
import { Router } from 'express'

import models from '../models'

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

export default router
