const to_cache = (req,res,next) => {
    res.setHeader('Cache-Control','max-age=31556926');
    next();
}

module.exports = {to_cache}