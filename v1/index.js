// 实现数据的双向绑定的三个步骤：
// 1.实现一个监听器Observer，用来劫持并监听所有属性，如果有变动的，就通知订阅者。
//注意，还需要实现一个Dep订阅器来专门收集这些订阅者，然后在监听器Observer和订阅者Watcher之间进行统一管理的。
// 2.实现一个订阅者Watcher，可以收到属性的变化通知并执行相应的函数，从而更新视图。
// 3.实现一个解析器Compile，可以扫描和解析每个节点的相关指令，并根据初始化模板数据以及初始化相应的订阅器。


//1.实现一个Observer
//Observer是一个数据监听器，其实现核心方法就是前文所说的Object.defineProperty( )。如果要对所有属性都进行监听的话，那么可以通过递归方法遍历所有属性值，并对其进行Object.defineProperty( )处理。
/**
 *
 * @param {*} data 被代理的obj
 * @param {*} key 被代理的obj key属性
 * @param {*} val 被代理的属性值
 */
function defineReactive(data,key,val){
  observe(val); // 如果val是Obj递归遍历所有子属性
  Object.defineProperty(data,key,{
    enumerable: true,//当且仅当该属性的enumerable为true时，该属性才能够出现在对象的枚举属性中。
    configurable: true,//当且仅当该属性的 configurable 为 true 时，该属性描述符才能够被改变，同时该属性也能从对应的对象上被删除。
    get() {
        return val;
    },
    set(newVal) {
        val = newVal;
        console.log('属性' + key + '已经被监听了，现在值为：“' + newVal.toString() + '”');
    }
  })
}
/**
 *
 * @param {*} data 监听的对象的所有子属性
 * @returns
 */
function observe(data) {
    if (!data || typeof data !== 'object') {
        return;
    }
    Object.keys(data).forEach(function(key) {
        defineReactive(data, key, data[key]);
    });
};

let library = {
  book1:{
    name:""
  },
  book2:""
}
observe(library);
library.book1.name = 'vue权威指南';
library.book2 = '没有此书籍';