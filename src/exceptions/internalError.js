const InternalError = (res, message) => {
    res.status(500).json({
        status: 500,
        message: message,
    })
}

export default InternalError
