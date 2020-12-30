
const validateReq = (schema) => {
    return (req, res, next) => {
        try{
            const { error } = schema.validate(req.body);
            if (error) {
                throw new Error(error);
            }
            next()
        }
        catch(err){
            res.write(`${err}`);
            res.end();
        }
    }
}
module.exports = validateReq;