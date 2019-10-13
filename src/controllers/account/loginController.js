import { Router } from 'express'
import models from '../../models'
import exceptions from '../../exceptions'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = Router()

router.post('/', async (req, res) => {
    try {
        const username = req.body.username
        const password = req.body.password
        const user = await models.User.findOne({ username: username })
        if (user !== null) {
            if (bcrypt.compareSync(password, user.password)) {
                user.lastlogin = new Date()
                await user.save()
                res.json({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    token: jwt.sign(
                        {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                        },
                        process.env.JWT_SECRET,
                        { expiresIn: 60 * 60 }
                    ),
                })
            } else {
                return exceptions.Unauthorized(
                    res,
                    'Usuario o password invalido'
                )
            }
        } else {
            return exceptions.Unauthorized(res, 'Usuario o password invalido')
        }
    } catch (err) {
        console.error(err)
        return exceptions.InternalError(res, err.message)
    }
})

export default router
