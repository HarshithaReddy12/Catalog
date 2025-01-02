const fs = require('fs');


function decodeValue(base, value) {
    return parseInt(value, base);
}


function lagrangeInterpolation(points) {
    let constantTerm = 0;
    const n = points.length;

    for (let i = 0; i < n; i++) {
        let xi = points[i][0];
        let yi = points[i][1];
        let li = 1;

        for (let j = 0; j < n; j++) {
            if (i !== j) {
                let xj = points[j][0];
                li *= xi / (xi - xj);
            }
        }

        constantTerm += yi * li;
    }

    return Math.round(constantTerm); 
}


function findConstantTerm(filePath) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const keys = data.keys;
    const k = keys.k;

   
    let points = [];
    for (let key in data) {
        if (key !== 'keys') {
            const x = parseInt(key, 10); 
            const base = parseInt(data[key].base, 10);
            const value = data[key].value;
            const y = decodeValue(base, value); 
            points.push([x, y]);
        }
    }
    points = points.slice(0, k);


    const c = lagrangeInterpolation(points);

    console.log('The constant term (c) is:', c);
}

findConstantTerm('testcase1.json');
findConstantTerm('testcase2.json');
