
function restrictedAddition(a,b){
    return a + b;
}

function freeAddition(){
    var output = 0;
    for(var i = 0, len = arguments.length;i<len;i++){
        output += arguments[i];
    }
    return output;
}
/* Demonstrate the Curry Function */
console.log('Method 1: '+ restrictedAddition.curry()(1)(2));

console.log('Method 2: '+ restrictedAddition.curry(1)(2));

console.log('Method 3: '+ restrictedAddition.curry(1,2)());

console.log('Method 4: '+ restrictedAddition.curry()(1,2));

console.log('Method 5: '+ restrictedAddition.curry(1)()(2));

console.log('Method 6: Takes infinite parameters: '+freeAddition.curry(0,0,0,1,1,0,null,1)());

