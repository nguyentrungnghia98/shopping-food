export default class Shopping{
    constructor(data){
        this.data = data;
    }
    fixNumber  (){
        // 4 1/2
       
        this.data.forEach(el=> {
            // if (!el.number)
             //{
                el.number+= '';
                const arr = el.number.split(' ');
                let newNumber = parseFloat(arr[0],10) ;
                if (arr.length === 2){
                    newNumber+= eval(arr[1]);
                }
                el.number = newNumber;
             //}
         });
        this.data.push(window.location.hash) ;
        
    }
}