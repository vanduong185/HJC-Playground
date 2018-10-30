 function printArray(a){
    var len = a.length, i = 0;
    if(len == 0 ) console.log("rong");
    else{
        do{
            console.log(a[i]);
        }while(++i<len);
    }
}

var a = [0];
printArray(a);