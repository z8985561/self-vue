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
  let count = 1;
  let dep = new Dep();
  Object.defineProperty(data,key,{
    enumerable: true,//当且仅当该属性的enumerable为true时，该属性才能够出现在对象的枚举属性中。
    configurable: true,//当且仅当该属性的 configurable 为 true 时，该属性描述符才能够被改变，同时该属性也能从对应的对象上被删除。
    get() {
        console.log(count++);
        // 是否需要添加订阅者
        if(Dep.target){
          // 在这里添加一个订阅者
          dep.addSub(Dep.target)
        }
        return val;
    },
    set(newVal) {
        if (val === newVal) {
            return;
        }
        val = newVal;
        dep.notify(); // 如果数据变化，通知所有订阅者
        console.log('属性' + key + '已经被监听了，现在值为：“' + newVal.toString() + '”');
    }
  })
}
/**
 *
 * @param {*} data 监听对象的所有子属性
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
/**
 * 订阅器
 *
 */
function Dep(){
  this.subs = []
}
Dep.prototype = {
 addSub(sub){
   this.subs.push(sub);
 },
 notify(){
   this.subs.forEach(sub=>{
     //订阅者Watcher 执行更新函数
     sub.update()
   })
 }
}
// 用于缓存订阅者，默认为空
Dep.target = null;

/**
 * 订阅者Watcher
 *
 * @param {*} vm 实例SelfVue实例对象
 * @param {*} exp 监听的属性
 * @param {*} cb 数据产生变化执行的回调函数
 */
function Watcher(vm,exp,cb){
  this.vm = vm;
  this.exp = exp;
  this.cb = cb;
  // 将自己添加到订阅者的操作
  this.value = this.get();
}
Watcher.prototype = {
  update(){
    this.run();
  },
  run(){
    let value = this.vm.data[this.exp];
    let oldVal = this.value;
    if(value !== oldVal){
      this.value = value;
      this.cb.call(this.vm, value, oldVal);
    }
  },
  get(){
    //缓存自己
    Dep.target = this;
    //强制执行监听器里的get函数
    let value = this.vm.data[this.exp]//这里调用了一次
    //释放自己
    Dep.target = null;
    return value;
  }
}

// 3.实现一个解析器Compile，可以扫描和解析每个节点的相关指令，并根据初始化模板数据以及初始化相应的订阅器。

/**
 * 将需要解析的dom节点存入fragment片段里再进行处理
 *
 * @param {*} el 需要处理的dom
 */
function nodeToFragment(el){
  let fragment = document.createDocumentFragment;
  let child = el.firstChild;
  while(child){
    // 将Dom元素移入fragment中
    fragment.appendChild(child);
    child = el.firstChild;
  }
  return fragment;
}
/**
 * 遍历各个节点，对含有相关指定的节点进行特殊处理
 *
 * @param {*} el 遍历的dom
 */
function compileElement(el){
  let childNodes = el.childNodes;
  let self = this;
  [].slice.call(childNodes).forEach(node=>{
    let reg = /\{\{(.*)\}\}/;
    let text = node.textContent;
    // 判断是否是符合这种形式{{}}的指令
    if(self.isTextNode(node) && reg.test(text)){
      self.compileText(node, reg.exec(text)[1]);
    }
    if (node.childNodes && node.childNodes.length) {
      // 继续递归遍历子节点
      self.compileElement(node);
    }
  })
}

function compileText(node,exp){}

/**
 * SelfVue
 *
 * @param {*} data 数据
 * @param {*} el 节点
 * @param {*} exp 监听的属性
 * @returns 返回当前实例
 */
function SelfVue(data,el,exp){
  this.data = data;
  let self = this;
  // 绑定代理属性
  Object.keys(data).forEach(function(key) {
      self.proxyKeys(key);
  });
  //监听SelfVue实例实参data
  observe(data);
  //这里调用了一次
  el.innerHTML = this.data[exp];
  new Watcher(this,exp,(val)=>{
    el.innerHTML = val;
  })
  return this;
}
//让访问selfVue的属性代理为访问selfVue.data的属性
SelfVue.prototype = {
  proxyKeys(key){
    let self = this;
    Object.defineProperty(this,key,{
      enumerable:true,
      configurable:true,
      get(){
        return self.data[key]
      },
      set(newVal){
        self.data[key] = newVal;
      }
    })
  }
}

var ele = document.querySelector('#name');
var selfVue = new SelfVue({
        name: 'hello world'
    }, ele, 'name');

window.setTimeout(function () {
    console.log('name值改变了');
    selfVue.name = 'canfoo';
}, 2000);