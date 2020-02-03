const consts = require('./constants');
module.exports = {

    basePrice: function(pricePerSquareMeter, surface) {
        return pricePerSquareMeter * surface;
    },

    rateNbPieces: function(basePrice, nbPieces) {
        const { rates } = consts;
        if (nbPieces === 1 || nbPieces === 2) {
            return basePrice * rates.oneOrtwoPieces;
        }
        if (nbPieces === 3 || nbPieces === 4) {
            return basePrice * rates.threeOrFourPieces;
        }
        if (nbPieces >= 5) {
            return basePrice * rates.morePieces;
        }
        return 0;
    },

    ratePropertyType: function(totalPrice, type) {
        const { types: { house, apartment }, rates } = consts;
        if (house === type) {
            return totalPrice * rates.house;
        }
        if (apartment === type) {
            return totalPrice * rates.apartment;
        }
        return 0;
    },

    ratePropertyState: function(totalPrice, state) {
        const { states: { needWork, renewed }, rates } = consts;
        if (state === needWork) {
            return totalPrice * rates.needWork;
        }
        if (state === renewed) {
            return totalPrice * rates.renewed;
        }
        return 0;
    },

    estimate: function(price, surface, nbPieces, type, state) {

        const basePrice = this.basePrice(price, surface);
        let totalPrice = basePrice + this.rateNbPieces(basePrice, nbPieces);
        totalPrice += this.ratePropertyType(totalPrice, type);
        totalPrice += this.ratePropertyState(totalPrice, state);

        return +totalPrice.toFixed(2);
    }
};