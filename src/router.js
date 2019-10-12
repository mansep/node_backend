import controllers from './controllers'
import { Router } from 'express'

export function secure() {
    const router = Router()
    router.use('/users', controllers.User)
    return router
}

export function open() {
    const router = Router()
    router.use('/login', controllers.Login)
    router.use('/register', controllers.Register)
    return router
}
