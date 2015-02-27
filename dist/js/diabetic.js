/**
 * Created by montaque22 on 2/24/15.
 */
(function(){
    var queue = (function(){
        var cell = {};
        function strip(str){
            return str.replace(/[^a-zA-Z ]/g, "");
        }
        return {
            store:function(item, args){
                var id = strip(item.toString());
                if(!cell[id]){
                    cell[id]={item:item, extra:args};
                }
            },
            find:function(item){
                var id = strip(item.toString());
                var obj = cell[id];
                cell[id] = null;
                return obj;
            }
        }
    })();
    /*
     Curry allows your to feed parameters
     to your function until all the requirements are met.

     Ex.
     add(a, b){
     //.. Logic to add a & b
     }

     // All are Equivalent
     add.curry()(1)(2);
     add.curry(1)(2);
     add.curry(1,2)();
     add.curry()(1,2);
     add.curry(1)()(2);
     // All of the above equals 3
     */
    Function.prototype.curry = function(){
        var length = this.length;
        var fn = this;
        var args = [].splice.call(arguments,0);
        return args.length >= length ?
            function(){
                return fn.apply(fn, args);
            }
            :
            function(){
                var combined = args.concat([].splice.call(arguments,0));
                return combined.length < length ?
                    fn.curry.apply(fn,combined)
                    :
                    fn.apply(fn, combined);
            };
    };

    /*
     Pipe feeds the value returned from the caller to the next
     function in the list. Pipe can take an unlimited number of
     functions to chain in the pipe.

     Pipe works similar to piping in the terminal however
     this function also employs currying to allow functions
     that require more than one parameter to have a chance to
     fill their remaining values.


     Ex.
     function add(a, b){
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

     var pipeOne = add.pipe(half);
     pipeOne(2,4); // Returns 2;

     var pipeTwo = add.pipe(half, sub);

     var pipeInSecondState = pipeTwo(8,2);
     // Pipe executed the add function which piped 10 to the half function.
     // The half function needs only 1 parameter which was fulfilled by the previous function so
     // half was executed with the value 10 which returned 5.
     // However the sub function needs 2 parameters, so it stored the 5 (which came from the half function)
     // internally and returned a curried function that needs only 1 more value to execute.

     pipeInSecondState(3)
     // Executes the sub function against the internally stored value 5 which returns 2

     pipeInSecondState(10)
     // The function can be reused multiple times and the values passed in will be executed against the
     // internally stored 5. So the function will return -5

     var pipeThree = add.pipe(sub, multi, half);
     var anotherPipeInSecondState = pipeThree(1)(2); // stores 3 internally
     // The add function needs two values so it will curry until the parameters are satisfied.

     var pipeInThirdState = anotherPipeInSecondState()()(5); // stores 2 internally
     // The sub function was fed 3 by the add function and needs 1 more parameter fulfilled.
     // It will return itself until the function is satisfied

     pipeInThirdState()()(2)()(2,3); // returns 6
     // The multi function needs two more of its parameters fulfilled so, like the example before it,
     // it will continue to return itself until it receives a input that satisfies the correct number
     // of input. pipeInThirdState()()(2)() were incorrect number of parameters. The function doesnt
     // execute until it reaches the input (2,3).
     // Since the next function only needs 1 parameter it is immediately fired which returns 6

     // The above executed the following:
     // ((5 - (1 + 2)) * 2 * 3) / 2
     */
    Function.prototype.pipe = function(){
        var functions = [].splice.call(arguments,0);
        var currentFunc = this;
        var savedInputs = [];
        return function stream(){
            var duplicatedFunctions = functions.slice();

            // If the arguments satisfy the current Function's Needs on the first try
            if(!savedInputs.length && arguments.length >= currentFunc.length)
                return helper(arguments);

            // If the arguments satisfy the current function's needs on any 'second' try
            else if(arguments.length + savedInputs.length >= currentFunc.length)
                return helper(savedInputs
                    .concat(Array
                        .prototype
                        .splice
                        .call(arguments,0)));

            // Return your self cuz the caller sucked
            else {
                // Only Save the arguments the first time
                // If we make it to this point means that we were being called recursively from the function before this
                // Saving the input is similar to saving the state and allows the user to pickup where they left off.
                if(!savedInputs.length){
                    savedInputs = savedInputs.concat([].splice.call(arguments,0));
                }

                return stream;

            }

            function helper(args){
                var nextFunction = duplicatedFunctions.shift();
                var param = currentFunc.apply(currentFunc, args);
                return (!nextFunction)? param : nextFunction.pipe.apply(nextFunction, duplicatedFunctions)(param);
            }
        };
    };


    /*
        Stores the values for a function to be used later on.
        This is supposed to be used with release.
     */
    Function.prototype.hold = function(){
        //store the function internally along with any arguments passed
        //only one function can be stored at a time
        // note : the function is still usable
        queue.store(this, arguments);
    };

    /*
        This releases the function that was held previously
        and executes it along with the arguments that were given at both
        instances.

        This companion function is useful in situations similar to the following:

        function add(a, b){
            return a + b
        }

        add.hold(10);

        setTimeout(function(){
            var ans = add.release(5);
            // returns 15
        },5000)

     */
    Function.prototype.release = function(){
        // call the function that was in queue
        // any previous arguements plus the ones passed in at this point are used
        // the function is released from holding and
        // the process can be repeated again
        var data = queue.find(this.toString());
        var args = [].splice.call(data.extra,0);
        var combine = args.concat([].splice.call(arguments, 0));
        return this.apply(this, combine);

    };

})();

