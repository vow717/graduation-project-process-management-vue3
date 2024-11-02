# 装饰器decorators

比继承更灵活

## 配置ts装饰器环境

在tsconfig.app.json里加

```
"compilerOptions": {
"experimentalDecorators": true
}
```

## 类装饰器

ClassDecorator 是一种类型定义（在 TypeScript 中，如果使用原生 JavaScript 编写类似功能，通常不需要显式的类型定义，但功能实现思路是一样的），它表示这个函数是专门用于装饰类的。
这个装饰器函数接受一个参数 target，它是一个 Function 类型的对象，在类装饰器的场景下，这个 Function 就是被装饰的类本身（在 JavaScript 中，类本质上也是函数）。
函数内部的操作是给被装饰类的原型对象（target.prototype）添加了一个名为 name 的属性，并将其值设置为 wkf。这意味着，任何通过这个被装饰类创建的实例对象，都可以访问到这个新增的 name 属性。

```
const oneDecorator:ClassDecorator=(target:Function)=>{
targer.prototype.name='wkf'
}

这里使用了装饰器的语法，将 oneDecorator 应用到 Tank 类上。当遇到这种语法时，JavaScript 引擎（或者在 TypeScript 编译后的环境下）会自动调用 oneDecorator 函数，并将 Tank 类作为参数传递给它。
经过这样的装饰操作后，Tank 类就被赋予了 oneDecorator 所添加的额外行为，也就是在其原型对象上新增了一个 name 属性。

@moveDecorator
class Tank{}

使用了 (t as any).name 的写法，是因为在原生 JavaScript 中，如果没有对 Tank 类进行额外的类型声明或处理，直接访问 name 属性可能会导致类型错误（因为 JavaScript 本身不知道 Tank 类有这个新增的属性）

const t=new Tank()
console.log((t as any).name)
```

如果不用@，直接moveDecorator(Tank),也可以实现，只是@语法糖可以自动实现
可以同时将装饰器叠加使用

## 装饰器工厂

根据需要发挥不同的装饰器

```Typescript
const MusicDecoratorFactory=(type:string):ClassDecorator=>{
    switch(type){
        case 'Tank':
         return (targer:Function)=>{
        targer.prototype.playMusic=():void=>{
            console.log("播放坦克音乐")
        }
    }
    case 'Player':
        return (targer:Function)=>{
            targer.prototype.playMusic=():void=>{
                console.log("播放游戏音乐")
            }
        }
    }
}
```

## 方法装饰器

@放到方法的上面

### 函数参数

target: Object：这个参数表示被装饰方法所属的对象。在 JavaScript 中，方法通常是挂载在某个对象上的，这个对象可以是类的实例、普通对象等。这里的 target 就是那个承载被装饰方法的对象实体。例如，如果是在类中定义的方法，那么 target 可能就是类的实例或者类本身（取决于具体的调用场景和装饰器的应用方式）。

propertyKey: string | symbol：此参数用于标识被装饰的方法。它是一个字符串或者符号类型的值，在类或对象中，每个方法都有一个唯一的名称（以字符串形式表示）或者可以用符号来标识（在一些特殊场景下使用符号作为方法的标识更合适，比如避免名称冲突等）。所以这个参数就是用来明确指出是对哪个具体的方法进行装饰操作。

descriptor: TypedPropertyDescriptor<T>：这个参数是一个描述符对象，它包含了关于被装饰方法的详细信息，比如方法的原始值（value 属性）、方法是否可写（writable 属性）、方法是否可枚举（enumerable 属性）以及方法是否可配置（configurable 属性）等。通过修改这个描述符对象，可以对被装饰方法的这些属性进行调整，从而实现对方法行为的改变。

```
const showDecorator:MethodDecorator=(targer:Object,propertyKey:string|symbol,descriptor:TypedPropertyDsecriptor<T>)=>{

value 属性：这是最重要的属性之一，它指向了方法的实际实现函数。也就是说，当你调用一个方法时，实际上执行的就是这个 value 属性所指向的函数。
writable 属性：用于表示这个方法是否可以被重新赋值。如果 writable 为 true，则允许对方法的 value 属性进行重新赋值操作，就像我们正在做的这件事；如果为 false，则尝试重新赋值会导致错误（在严格模式下）。
enumerable 属性：决定了这个方法在对象的属性枚举操作（例如使用 for...in 循环遍历对象属性时）中是否会被列举出来。
configurable 属性：表示这个方法是否可以被删除或者其属性（如 value、writable、enumerable、configurable 等）是否可以被修改。

descriptor.value=()=>{
console.log('')
}
}
```

---

首先，通过 const method = descriptor.value; 保存了被装饰方法的原始实现函数。这里的 descriptor.value 就是指向被装饰方法原本要执行的函数。

然后，对 descriptor.value 进行重新赋值操作。重新赋值后的函数是一个箭头函数，它在被调用时，会先调用之前保存的原始方法 method()，获取其返回结果，然后将这个返回结果嵌入到一个 HTML 格式的字符串中，即 尊敬的<span style="color:red">${method()}</span>先生。这样，当被装饰的方法被调用时，它将不再执行原来的单纯返回操作，而是返回一个带有特定 HTML 样式的字符串，用于在后续插入到文档中时以特定的样式显示。

```Typescript
const highlightDecorator:MethodDecorator=(targer:Object,propertyKey:string|symbol,descriptor:TypedPropertyDsecriptor<T>)=>{
    const method=descriptor.value
      descriptor.value=()=>{
        return `尊敬的<span style="color:ref">${method()}</span>先生`
    }
}
class User{
    @highlightDecorator
    public response(){
        return 'wkf'
    }
}

document.body.insertAdjacentHTML('beforeend',new User().response)
```

## 方法装饰器工厂函数大体格式

```Typescript
// 方法装饰器工厂函数
function logDecoratorFactory(logMessage) {
    return function (target:Object, propertyKey:string|symbol, descriptor:TypedPropertyDescriptor<T>) {
        // 保存原始方法
        const originalMethod = descriptor.value;

        // 重新定义方法
        descriptor.value = async function (...args) {
            console.log(logMessage +'方法开始执行');

            // 执行原始方法并获取结果
            const result = await originalMethod.apply(this, args);

            console.log(logMessage +'方法执行完毕');

            return result;
        };

        return descriptor;
    };
}

```

## 延迟执行

都可以用这个方法解决

```Typescript
const method=descriptor.value
descriptor.value=()=>{
    setTimeout(()=>{
        method()
    },2000)
}
```

但这里时间写死了，可以用装饰器工厂(times:number)

## 根据权限控制访问

### apply方法

apply 是 JavaScript 中函数对象的一个方法，它用于改变函数执行时的 this 上下文，并传入参数来调用函数。其语法为：

function.apply(thisArg, [argsArray])

thisArg：是函数执行时 this 的指向对象。在这行代码中，this 通常是指被装饰方法所属的对象，也就是在类的场景下，可能是类的实例（当方法是实例方法时）或者类本身（在某些特殊情况下，比如静态方法装饰器等）。通过传入 this，可以确保原始方法在执行时能够正确地访问到所属对象的属性和方法等，就好像它是在正常情况下被调用一样。

argsArray：是一个包含了要传递给函数的所有参数的数组。在这行代码中，args 就是收集了 myMethod 方法调用时传入的所有参数的数组（例如，如果 myMethod 方法原本接收多个参数，那么在调用时传入的这些参数就会被收集到 args 数组中），通过 apply 方法将这个数组作为参数传递给原始方法，就可以确保原始方法能够接收到正确的参数进行执行

```Typescript
const user:User={
    name:'wkf',
    //权限
    permissions:['store','manage','update'],
}
const AccessDecorator=(user:User,keys:string[]):MethodDecorator=>{
    return (target:Object,propertyKey:string|symbol,decriptor:TypedPropertyDsecriptor<T>)=>{
       // 创建一个闭包来保存原始的descriptor.value
        let originalDescriptorValue = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            // 从方法调用参数中获取用户对象
            const user: User = args[0];
            const validate = () => {
                return keys.every(k => user.permissions.includes(k));
            };

            if (validate()) {
                // 如果有权限，执行原始方法逻辑，并返回结果
                return await originalDescriptorValue.apply(this, args);
            } else {
                alert('无权限');
                return;
            }
        };
        return descriptor;
}

class myClass{
    @AccessDecorator(['store','manage','update'])
    myMethod(user:User)
}
```

## 属性装饰器

@写在属性前面

```Typescript
const ParamsDecorator:PropertyDecorator=(...args:any[])=>{
    console.log(args)
    //args[2]表示的是参数的位置
}

class Hd{
    public show(id:number=1,@ParamsDecorator content:string)
}
```

### 随机颜色装饰器

```Typescript
const RandomColorDecorator:PropertyDecorator=(target:object,propertyKey:string|symbol)=>{
    const color:string[]=['red','blur','yellow','green']
    //在装饰器 RandomColorDecorator 中使用了 Object.defineProperty 对 color 属性重新定义了属性描述符，添加了get()函数作为属性描述符的一部分，这样被修饰器修饰的属性就可以使用
    //其中在使用Object.defineProperty()方法定义属性描述符时，get和set是固定的名称，用于定义属性的访问器（accessor）。
    //get函数是一个无参数的函数，当读取属性的值时被调用。它的作用是返回属性应该呈现的值。
    //set函数接受一个参数，当试图修改属性的值时被调用。这个参数就是新赋予属性的值，在set函数内部可以根据业务逻辑来处理这个新值，比如进行数据验证、更新相关的内部变量等操作。
    Object.defineProperty(target,propertyKey,{
        get(){
            return colors[Math.floor(Math.random()*colors.length)]
        },
    })
}
class Hd{
    @RandomColorDecorator
    public color=string|undefined
}
console.log(new Hd().color)
```
