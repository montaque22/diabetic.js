/**
 * Created by montaque22 on 2/24/15.
 */

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

Function.prototype.pipe = function(){
    var functions = [].splice.call(arguments,0);
    var currentFunc = this.curry();
    return function(){
        var ans = currentFunc.apply(currentFunc,arguments);
        if(arguments.length < currentFunc.length){
            return ans.pipe.apply(ans,functions);
        }else if(!functions.length){
            return ans;
        }
        functions.forEach(function(el){
            ans = el(ans);
        });
        return ans;
    };
};
