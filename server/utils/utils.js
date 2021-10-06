/**
 * loging {originalUrl, protocol, hostname, path, method, headers} object with return it.
 * @param {Object} req express request Object
 * @returns {Object} {originalUrl, protocol, hostname, path, method, headers} as Object
 */
function logRequest(req){
    const obj = {
        originalUrl: req.originalUrl,
        protocol: req.protocol,
        hostname: req.hostname,
        path: req.path,
        method: req.method,
        headers: req.headers,
    }
    console.log(obj);
    return obj
}

/**
 * loging and return Error 500 as response 
 * @param {Object} res express Response Objeect
 * @param {Object} err error from catch or any things
 */
function internalError (res,err){
    console.log("Error: ",err);
    res.status(500).json({
        error: "Internal VPN Server Error"
    })
};



module.exports = { internalError, logRequest }