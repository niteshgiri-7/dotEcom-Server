class ErrorHandler extends Error {
    constructor(errMsg, statusCode) {
        super(errMsg);
        this.errMsg = errMsg;
        this.statusCode = statusCode;
        this.statusCode = statusCode;
    }
}
export default ErrorHandler;
