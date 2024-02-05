class ApiError extends error{
    constructor(statusCode,
        message="Something went wrong",
        errors=[],
        stack=""){

        super(message);
        this.data = null;
        this.message = message;
        this.status = statusCode;
        this.errors = errors;
        this.success = false;

        if(stack){
            this.statck = stack;
        }else{
            Error.captureStackTrace(this, this.constructor);
        }

    }
}

export default ApiError;