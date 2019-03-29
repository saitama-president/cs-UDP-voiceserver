var a={
  "A":1,
  "B":2,
  "C":4,
  
};

function hashFilter(hash,func:(v:any)=>boolean){
  Object.keys(hash).forEach(k=>{
    if(func(hash[key])){
      delete(hash[k]);
    }
  });
}


