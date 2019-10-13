const Unauthorized = (res, message) => {
    res.status(401).json({
        status: 401,
        message: message,
    })
}

export default Unauthorized
