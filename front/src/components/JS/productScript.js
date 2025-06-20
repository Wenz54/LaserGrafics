var minusButton = document.getElementById('minus');
var plusButton = document.getElementById('plus');
var qualityElement = document.getElementById('quality');
var priceElement = document.getElementById('price');
var osnastkiPriceEnd = document.getElementById('osnastkiPrice');
var profiBtn1 = document.getElementById('professional1');
var profiBtn2 = document.getElementById('professional2');
var printyBtn1 = document.getElementById('printy1');
var printyBtn2 = document.getElementById('printy2');
var idealBtn = document.getElementById('ideal');
var priceOfOsn1 = document.getElementById('priceOfOsn1');
var priceOfOsn2 = document.getElementById('priceOfOsn2');
var priceOfOsn3 = document.getElementById('priceOfOsn3');
var priceOfOsn4 = document.getElementById('priceOfOsn4');
var priceOfOsn5 = document.getElementById('priceOfOsn5');
var emptyBtn = document.getElementById('empty');

var priceText = priceElement.textContent;
var unitPrice = parseFloat(priceText);
var professionalPriceText1 = priceOfOsn1.textContent;
var professionalPrice1 = parseFloat(professionalPriceText1);
var professionalPriceText2 = priceOfOsn2.textContent;
var professionalPrice2 = parseFloat(professionalPriceText2);
var printyPriceText1 = priceOfOsn3.textContent;
var printyPrice1 = parseFloat(printyPriceText1);
var printyPriceText2 = priceOfOsn4.textContent;
var printyPrice2 = parseFloat(printyPriceText2);
var idealPriceText = priceOfOsn5.textContent;
var idealPrice = parseFloat(idealPriceText);
var sumPriceOsnastki = 0;

var minQuality = 1;
var maxQuality = 100;
var maxOsnastki = 100;

function updatePriceAndQuality(newQuality) {
    if (newQuality < minQuality) {
        newQuality = minQuality;
    } else if (newQuality > maxQuality) {
        newQuality = maxQuality;
    }

    qualityElement.textContent = newQuality;

    var newPrice = unitPrice * newQuality;
    priceElement.textContent = newPrice.toFixed(2) + 'р';
}

profiBtn1.addEventListener('click', function() {
    sumPriceOsnastki = professionalPrice1;
    osnastkiPriceEnd.textContent = sumPriceOsnastki.toFixed(2) + 'р';
    var currentQualityOsnastki = sumPriceOsnastki * parseFloat(qualityElement.textContent);
    osnastkiPriceEnd.textContent = currentQualityOsnastki.toFixed(2) + 'р';
});

profiBtn2.addEventListener('click', function() {
    sumPriceOsnastki = professionalPrice2;
    osnastkiPriceEnd.textContent = sumPriceOsnastki.toFixed(2) + 'р';
    var currentQualityOsnastki = sumPriceOsnastki * parseFloat(qualityElement.textContent);
    osnastkiPriceEnd.textContent = currentQualityOsnastki.toFixed(2) + 'р';
});

printyBtn1.addEventListener('click', function() {
    sumPriceOsnastki = printyPrice1;
    osnastkiPriceEnd.textContent = sumPriceOsnastki.toFixed(2) + 'р';
    var currentQualityOsnastki = sumPriceOsnastki * parseFloat(qualityElement.textContent);
    osnastkiPriceEnd.textContent = currentQualityOsnastki.toFixed(2) + 'р';
});

printyBtn2.addEventListener('click', function() {
    sumPriceOsnastki = printyPrice2;
    osnastkiPriceEnd.textContent = sumPriceOsnastki.toFixed(2) + 'р';
    var currentQualityOsnastki = sumPriceOsnastki * parseFloat(qualityElement.textContent);
    osnastkiPriceEnd.textContent = currentQualityOsnastki.toFixed(2) + 'р';
});

idealBtn.addEventListener('click', function() {
    sumPriceOsnastki = idealPrice;
    osnastkiPriceEnd.textContent = sumPriceOsnastki.toFixed(2) + 'р';
    var currentQualityOsnastki = sumPriceOsnastki * parseFloat(qualityElement.textContent);
    osnastkiPriceEnd.textContent = currentQualityOsnastki.toFixed(2) + 'р';
});

emptyBtn.addEventListener('click', function() {
    sumPriceOsnastki = 0;
    osnastkiPriceEnd.textContent = sumPriceOsnastki.toFixed(2) + 'р';
});

minusButton.addEventListener('click', function() {
    var currentQuality = parseInt(qualityElement.textContent);
    updatePriceAndQuality(currentQuality - 1);
    var currentQualityOsnastki = sumPriceOsnastki * parseFloat(qualityElement.textContent);
    osnastkiPriceEnd.textContent = currentQualityOsnastki.toFixed(2) + 'р';
    var stampPlusOsnastka = parseFloat(priceElement.textContent) + parseFloat(qualityElement.textContent);
});

plusButton.addEventListener('click', function() {
    var currentQuality = parseInt(qualityElement.textContent);
    updatePriceAndQuality(currentQuality + 1);
    var currentQualityOsnastki = sumPriceOsnastki * parseFloat(qualityElement.textContent);
    osnastkiPriceEnd.textContent = currentQualityOsnastki.toFixed(2) + 'р';
    var stampPlusOsnastka = parseFloat(priceElement.textContent) + parseFloat(osnastkiPriceEnd.textContent);
});

