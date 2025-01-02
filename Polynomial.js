const fs = require('fs');
function interpretValue(base, encodedValue) {
    return parseInt(encodedValue, base);
}
function calculateConstantTerm(dataPoints) {
    if (dataPoints.length === 0) {
        console.error("No data points provided.");
        return NaN;
    }

    let constant = 0;
    const totalPoints = dataPoints.length;

    for (let i = 0; i < totalPoints; i++) {
        let xCoord = dataPoints[i][0];
        let yCoord = dataPoints[i][1];
        let product = 1;

        for (let j = 0; j < totalPoints; j++) {
            if (i !== j) {
                let otherX = dataPoints[j][0];
                if (xCoord === otherX) {
                    console.error("Duplicate x-coordinates detected at index", i, "and", j);
                    return NaN;
                }
                product *= xCoord / (xCoord - otherX);
            }
        }

        constant += yCoord * product;
    }

    return Math.round(constant); 
}
function deriveConstantFromFile(fileName) {
    const fileContent = JSON.parse(fs.readFileSync(fileName, 'utf8'));
    const settings = fileContent.settings;
    const requiredPoints = settings.required;

    let dataPoints = [];
    for (let key in fileContent) {
        if (key !== 'settings') {
            const xValue = parseInt(key, 10);
            const numeralBase = parseInt(fileContent[key].numeralBase, 10);
            const encoded = fileContent[key].encodedValue;
            const yValue = interpretValue(numeralBase, encoded);
            dataPoints.push([xValue, yValue]);
        }
    }
    dataPoints = dataPoints.slice(0, requiredPoints);
    const constantResult = calculateConstantTerm(dataPoints);

    console.log('Calculated constant term is:', constantResult);
}
deriveConstantFromFile('testcase1.json');
deriveConstantFromFile('testcase2.json');
