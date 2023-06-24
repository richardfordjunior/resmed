module.exports =  {
    groundLevelOzone: generateRandomValues(0, 0.604), //'0 - 0.604 ',
    carbonMonoxide: generateRandomValues(0, 50.4), //'0 - 50.4',
    sulfurDioxide : generateRandomValues(0, 1004), //'0 - 1004',
    nitrogenDioxide: generateRandomValues(0, 2049) //'0 - 2049'
}


function generateRandomValues (min, max ){
    return Math.random() * (max - min) + min;
}