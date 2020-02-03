const chai = require('chai');
const estimator = require('../../app/helpers/estimator');
const { rates, types, states } = require('../../app/helpers/constants');
chai.should();

const { expect } = chai;

describe('Estimateur Immobilier Tests', function() {
    const surface = 45;
    const pricePerSquare = 2500;
    const basePrice = surface * pricePerSquare;

    describe('Prix De Base', function() {
        it('Retourne le produit de la surface par le prix au mètre carré', function() {
            expect(estimator.basePrice(pricePerSquare, surface)).to.equal(basePrice);
        });
    });

    describe('Nombre De Pièces', function() {
        it('Retourne 5% du prix lorsque le nombre de pièces est de 1 ou 2', function() {
            const price = basePrice * rates.oneOrtwoPieces;
            expect(estimator.rateNbPieces(basePrice, 1)).to.equal(price);
            expect(estimator.rateNbPieces(basePrice, 2)).to.equal(price);
            expect(estimator.rateNbPieces(basePrice, 3)).to.not.equal(price);
            expect(estimator.rateNbPieces(basePrice, 0)).to.equal(0);
        });
        it('Retourne 2% du prix lorsque le nombre de pièces est de 3 ou 4', function() {
            const price = basePrice * rates.threeOrFourPieces;
            expect(estimator.rateNbPieces(basePrice, 3)).to.equal(price);
            expect(estimator.rateNbPieces(basePrice, 4)).to.equal(price);
            expect(estimator.rateNbPieces(basePrice, 10)).to.not.equal(price);
        });

        it("Retourne -1% du prix lorsqu'il y a plus de 4 pièces", function() {
            const price = basePrice * rates.morePieces;
            expect(estimator.rateNbPieces(basePrice, 5)).to.equal(price);
            expect(estimator.rateNbPieces(basePrice, 10)).to.equal(price);
            expect(estimator.rateNbPieces(basePrice, 1)).to.not.equal(price);
        });
    });
    describe('Type De Bien Immobilier', function() {
        it("Retourne 3% du prix si c'est une MAISON", function() {
            const price = basePrice * rates.house;
            expect(estimator.ratePropertyType(basePrice, types.house)).to.equal(price);
            expect(estimator.ratePropertyType(basePrice, types.apartment)).not.to.equal(price);
            expect(estimator.ratePropertyType(basePrice, 3)).to.equal(0);
        });

        it("Retourne 5% du prix si c'est une APPARTEMENT", function() {
            const price = basePrice * rates.apartment;
            expect(estimator.ratePropertyType(basePrice, types.apartment)).to.equal(price);
            expect(estimator.ratePropertyType(basePrice, types.house)).not.to.equal(price);
            expect(estimator.ratePropertyType(basePrice, 3)).to.equal(0);
        });
    });

    describe('État Général Du Bien', function() {
        it("Retourne -10% du prix si le bien 'Nécessite des travaux'", function() {
            const price = basePrice * rates.needWork;
            expect(estimator.ratePropertyState(basePrice, states.needWork)).to.equal(price);
            expect(estimator.ratePropertyState(basePrice, states.renewed)).not.to.equal(price);
            expect(estimator.ratePropertyState(basePrice, states.good)).to.equal(0);
        });

        it("Retourne 12% du prix si bien est 'Refait à neuf'", function() {
            const price = basePrice * rates.renewed;
            expect(estimator.ratePropertyState(basePrice, states.renewed)).to.equal(price);
            expect(estimator.ratePropertyState(basePrice, states.needWork)).not.to.equal(price);
            expect(estimator.ratePropertyState(basePrice, states.good)).to.equal(0);
        });

        it("Retourne 0 si le bien est en 'Bon état'", function() {
            expect(estimator.ratePropertyState(basePrice, states.good)).to.equal(0);
        });
    });

    describe('Estimation Prix Total De Biens Immobiliers', function() {
        const propertyStates = {
            [states.needWork]: '​Nécessite des travaux',
            [states.good]: 'Bon état',
            [states.renewed]: 'Refait à neuf'
        };

        const testEstimateWithData = (data, propertyType) => {
            const { surface, nbPieces, pricePerSquareMeter, state, expectedPrice } = data;
            const propertyState = propertyStates[state];
            it(`De ${surface} m2 avec ${nbPieces} pièce(s) ${propertyState} et coûte ${pricePerSquareMeter} €/m2`, function() {
                expect(estimator.estimate(pricePerSquareMeter, surface, nbPieces, propertyType, state)).to.equal(expectedPrice);
            });
        };

        describe('Une MAISON', function() {
            const houseTestData = [
                { surface: 45, pricePerSquareMeter: 1000, nbPieces: 1, state: states.needWork, expectedPrice: 43800.75 },
                { surface: 30, pricePerSquareMeter: 2200, nbPieces: 2, state: states.good, expectedPrice: 71379 },
                { surface: 95, pricePerSquareMeter: 1500, nbPieces: 4, state: states.renewed, expectedPrice: 167675.76 },
                { surface: 120, pricePerSquareMeter: 2500, nbPieces: 6, state: states.renewed, expectedPrice: 342619.2 },
            ];

            houseTestData.forEach(house => {
                testEstimateWithData(house, types.house);
            });
        });

        describe('Un APPARTEMENT', function() {
            const apartmentTestData = [
                { surface: 15, pricePerSquareMeter: 2000, nbPieces: 2, state: states.renewed, expectedPrice: 37044 },
                { surface: 55, pricePerSquareMeter: 1800, nbPieces: 3, state: states.good, expectedPrice: 106029 },
                { surface: 65, pricePerSquareMeter: 800, nbPieces: 4, state: states.needWork, expectedPrice: 50122.8 },
                { surface: 95, pricePerSquareMeter: 1300, nbPieces: 6, state: states.renewed, expectedPrice: 143783.64 },
            ];
            apartmentTestData.forEach(apartment => {
                testEstimateWithData(apartment, types.apartment);
            });
        });
    });
});