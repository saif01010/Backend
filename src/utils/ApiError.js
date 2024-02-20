class ApiError extends Error{
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
            this.stack = stack;
        }else{
            Error.captureStackTrace(this, this.constructor);
        }

    }
}

export  {ApiError};