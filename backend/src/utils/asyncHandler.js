export default function asyncHandler(requestHandler) {
    return async function(req, res, next) {
        try {
            await requestHandler(req, res, next);
        }
        catch (error) {
            console.log("An error occured in request Handler:", error.message);
        }
    }
}