const handleDatabaseErrors = (error, req, res, next) => {

    // DEFAULT ERROR RESPONCE
    let errorResponse = {
        success: false,
        message: 'A database error occurred',
        errorCode: 'DATABASE_ERROR'
    };

    // DUPLICATE KEY ERROR HANDLER
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        const value = error.keyValue[field];

        errorResponse.message = `${field} '${value}' is already registered`
        errorResponse.errorCode = 'DUPLICATE_ENTRY'
        errorResponse.field = field;

        return res.status(409).json(errorResponse);
    }

    // VALIDATION ERROR HANDLER
    if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message)

        errorResponse.message = 'Validation failed'
        errorResponse.errorCode = 'VALIDATION_ERROR'
        errorResponse.details = errors;

        return res.status(400).json(errorResponse)
    }

    // CAST ERROR HANDLER
    if (error.name === 'CastError') {
        errorResponse.message = `Invalid ${error.path}: ${error.value}`
        errorResponse.errorCode = 'INVALID_ID_FORMAT'

        return res.status(400).json(errorResponse)
    }

    // CONNECTION ERROR HANDLER
    if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
        errorResponse.message = 'Database connection error. Please try again.'
        errorResponse.errorCode = 'DATABASE_CONNECTION_ERROR'

        return res.status(503).json(errorResponse)
    }

    // FALLBACK ERROR HANDLER
    console.error('Unhandled Database Error: ', error)
    return res.status(500).json(errorResponse)
}

export default handleDatabaseErrors;