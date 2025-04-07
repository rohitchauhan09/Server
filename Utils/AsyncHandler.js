const asyncHandler = (fun) => {
    return async (req,res,next) => {
        try {
            await fun(req,res)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}
export default asyncHandler