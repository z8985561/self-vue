var Book = {}
var name = '';
Object.defineProperty(Book, 'name', {
  set: function (value) {
    name = value;
    console.log('你取了一个书名叫做' + value);
  },
  get: function () {
    return '《' + name + '》'
  }
})

Book.name = 'vue权威指南';  // 你取了一个书名叫做vue权威指南
console.log(Book.name);  // 《vue权威指南》


/**
 * 实现一个简易版的监听器Observer
 *
 * @param {*} data 被监听的对象
 * @param {*} key 监听对象的子属性
 * @param {*} val 监听对象的子属性值
 */
function defineReactive(data,key,val){
  // 如何子属性的值是对象，执行遍历
  observer(val)
  // 这里使用闭包的原理获取到val暂存起来
  Object.defineProperty(data,key,{
    configurable:true,
    enumerable:true,
    set(newVal){
      val = newVal;
      console.log(`${key}的值更变为${newVal}`);
    },
    get(){
      console.log(`获取${key}的值`);
      return val;
    }
  });
}
/**
 * 实现一个简易版的监听器Observer
 *
 * @param {*} data
 */
function observer(data){
  if(!data || typeof data !== 'object'){
    return;
  }
  Object.keys(data).forEach(key => {
    defineReactive(data,key,data[key])
  });
}

let library = {
  book1:{
    name:""
  },
  book2:""
}
observer(library)