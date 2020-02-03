const { ValidationError } = require('../helpers/errors');
const estimator = require('../helpers/estimator');
module.exports = {
    estimateProperty: function(req, res, next) {
        const data = req.body;
        const requiredFields = ['prix', 'surface', 'nbPieces', 'type', 'state'];
        let errorMsg;
        //sanitization and valiation
        const valid = requiredFields.every((key) => {
            const value = +data[key];
            if (isNaN(value) || (key === 'nbPieces' && !Number.isInteger(value))) {
                errorMsg = `Invalid value for '${key}'`;
                return false;
            }
            data[key] = value;
            return true;
        });
        if (!valid) {
            return next(new ValidationError(errorMsg));
        }
        const { prix, surface, nbPieces, type, state } = data;
        const estimatedPrice = estimator.estimate(prix, surface, nbPieces, type, state);
        res.send({ estimatedPrice });
    }
};