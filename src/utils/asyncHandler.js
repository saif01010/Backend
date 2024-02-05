const asyncHandler = (responsHandler)=>{
   return (req,res,next)=>{
        Promise.resolve(responsHandler(req,res,next)).catch(next);
    }
}

export {asyncHandler}