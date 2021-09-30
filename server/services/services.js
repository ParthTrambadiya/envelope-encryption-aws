const axios = require('axios');

exports.rootRoute = (req, res) => {
    res.render('index')
}

exports.downloadRoute = (req, res) => {
    axios.get(req.headers.referer + 'display/api')
        .then(function(response){
            res.render('download', {items: response.data})
        })
        .catch(err => {
            res.send(err)
        })
}