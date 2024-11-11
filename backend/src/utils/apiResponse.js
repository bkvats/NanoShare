export default function apiResponse(statusCode, message, data) {
    return {
        statusCode,
        message: message || "success",
        data,
        success: statusCode < 400
    }
}