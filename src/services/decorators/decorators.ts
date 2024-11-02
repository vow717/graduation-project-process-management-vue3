import type { Ref } from 'vue'

export const storeCacheFactory = (dataR: Ref<any>): MethodDecorator => {
  return (
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    const originalMethod = descriptor.value
    descriptor.value = async (...args: any[]) => {
      const data = dataR.value
      //每个对象都继承自 Object.prototype，其中的 toString() 方法默认会返回对象的类型信息。但是直接调用对象自身的 toString() 方法（比如 val.toString()）可能会因为对象自身对 toString() 方法进行了重写而无法准确得到对象的类型信息。
      //为了能准确获取对象的原始类型信息，就需要使用 Object.prototype.toString.call() 这种调用方式。它通过将目标对象 val 作为 call() 方法的参数传递给 Object.prototype.toString，使得在 toString() 方法内部能够以正确的方式获取并返回对象的原始类型信息，格式为 [object 具体类型名]。
      //通过 Object.prototype.toString.call() 方法来准确判断变量 val 的类型是否为数组或者对象。
      if (
        Object.prototype.toString.call(data) === '[object Array]' ||
        Object.prototype.toString.call(data) === '[object Object]'
      ) {
        return new Promise((reslove) => {
          setTimeout(() => {
            reslove(dataR.value)
          }, 0)
        })
      }
      const d = await originalMethod.apply(descriptor, args)
      dataR.value = d
      return dataR.value
    }
    return descriptor
  }
}

export const storeCacheMapFactory = (dataR: Ref<Map<any, any>>): MethodDecorator => {
  return (
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    const originalMethod = descriptor.value
    descriptor.value = async (...args: any[]) => {
      const pid = args[0]
      const data = dataR.value as Map<any, any>
      const data_pid = data.get(pid)
      if (Object.prototype.toString.call(data_pid) === '[object Map]' && data_pid) {
        return new Promise((reslove) => {
          setTimeout(() => {
            reslove(data_pid)
          }, 0)
        })
      }
      const d = await originalMethod.apply(descriptor, args)
      dataR.value.set(pid, d)
      return data.get(pid)
    }
    return descriptor
  }
}
