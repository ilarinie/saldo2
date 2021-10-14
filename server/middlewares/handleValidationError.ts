import { validationResult } from "express-validator"

export const handleValidationError = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(406).sendResponse({ message: 'Something went wrong', payload: errors.array() })
    } else {
        next()
    }
}