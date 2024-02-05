class ApiResponse{
    constructor(statusCode,data,message="Success"){
        this.data = data;
        this.message = message;
        this.status = statusCode <400;
        this.success = true;
    }
}

export default ApiResponse;