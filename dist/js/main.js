
function add(a,b){
    return a + b;
}
function sub(a, b){
    return b - a;
}
function multi(a, b, c){
    return a * b * c;
}
function half(a){
    return a / 2;
}
function freeAddition(){
    var output = 0;
    for(var i = 0, len = arguments.length;i<len;i++){
        output += arguments[i];
    }
    return output;
}
/* Demonstrate the Curry Function */
console.log('Method 1: '+ add.curry()(1)(2));

console.log('Method 2: '+ add.curry(1)(2));

console.log('Method 3: '+ add.curry(1,2)());

console.log('Method 4: '+ add.curry()(1,2));

console.log('Method 5: '+ add.curry(1)()(2));

console.log('Method 6: Takes infinite parameters: '+freeAddition.curry(0,0,0,1,1,0,null,1)());

var pipeOne = add.pipe(half);
console.log('Should Return 3: ' + pipeOne(2,4));

var pipeTwo = add.pipe(half, sub);

var pipeInSecondState = pipeTwo(8,2);
// Pipe executed the add function which piped 10 to the half function.
// The half function needs only 1 parameter which was fulfilled by the previous function so
// half was executed with the value 10 which returned 5.
// However the sub function needs 2 parameters, so it stored the 5 (which came from the half function)
// internally and returned a curried function that needs only 1 more value to execute.

console.log('Should Return -2: ' + pipeInSecondState(3));
// Executes the sub function against the internally stored value 5 which returns -2 --> (3 - 5)

console.log('Should Return 5: ' + pipeInSecondState(10));
// The function can be reused multiple times and the values passed in will be executed against the
// internally stored 5. So the function will return 5 --> (10 - 5)

var pipeThree = add.pipe(sub, multi, half);
var anotherPipeInSecondState = pipeThree(1)(2); // stores 3 internally
// The add function needs two values so it will curry until the parameters are satisfied.

var pipeInThirdState = anotherPipeInSecondState()()(5); // stores 2 internally
// The sub function was fed 3 by the add function and needs 1 more parameter fulfilled.
// It will return itself until the function is satisfied

console.log('Should Return 6: ' + pipeInThirdState()()(2)()(2,3)); // returns 6
// The multi function needs two more of its parameters fulfilled so, like the example before it,
// it will continue to return itself until it receives a input that satisfies the correct number
// of input. pipeInThirdState()()(2)() were incorrect number of parameters. The function doesnt
// execute until it reaches the input (2,3).
// Since the next function only needs 1 parameter it is immediately fired which returns 6

// All of he above executed the following:
// ((5 - (1 + 2)) * 2 * 3) / 2 = 6

console.log('Should be the same: ' + anotherPipeInSecondState(5)(2,3));


add.hold(2);
var xx = add.release(1);
