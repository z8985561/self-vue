function defineReactive(data,key,val){
  observe(val);
  Object.defineProperty(data,key,{
    enumerable:true,
    configurable:true,
    get(){
      console.log(`获取${key}的值`);
      return val;
    },
    set(newVal){
      val = newVal;
      console.log(`修改${key}的值为${newVal}`);

    }
  });
}

function observe(data){
  if(!data || typeof data != "object"){
    return;
  }
  Object.keys(data).forEach(key=>{
    defineReactive(data,key,data[key])
  })
}

let library = {
  book1:"vuejs",
  book2:"nothing"
}
observe(library)
library.book1
library.book2 = "reactjs"
