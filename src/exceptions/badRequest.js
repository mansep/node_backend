const BadRequest = (res, message) => {
    res.status(400).json({
        status: 400,
        message: message,
    })
}

export default BadRequest
