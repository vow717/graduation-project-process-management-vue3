import { createElLoading } from '@/components/loading'
import type { Ref } from 'vue'

export const storeCacheFactory = (dataR: Ref<any>, doStore = true): MethodDecorator => {
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
        doStore &&
        (Object.prototype.toString.call(data) === '[object Array]' ||
          Object.prototype.toString.call(data) === '[object Object]')
      ) {
        return Promise.resolve(dataR.value)
      }
      dataR.value = await originalMethod.apply(descriptor, args)
      return dataR.value
    }
    return descriptor
  }
}

//keyJoin是一个数组，里面存放的是要拼接的args的索引值，比如keyJoin=[0,1]，就是拼接args[0]和args[1]作为key值
//为什么要这么做呢：因为有多个processFiles和processScores要缓存，map根据processId找更快
//如果keyJoin存在，就用keyJoin对应的那几个args作为key值，否则就默认全部args拼接作为key值
export const storeCacheMapFactory = (
  dataR: Ref<Map<any, any>>,
  keyJoin?: number[]
): MethodDecorator => {
  return (
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    const originalMethod = descriptor.value
    descriptor.value = async (...args: any[]) => {
      let key = args.join('-')
      //如果keyJoin存在，就用keyJoin对应的那几个args作为key值，否则就默认全部args拼接作为key值
      if (keyJoin) {
        const keyArr = []
        for (const index of keyJoin) {
          keyArr.push(args[index])
        }
        key = keyArr.join('-')
      }
      const data = dataR.value as Map<any, any>
      const data_pid = data.get(key)
      if (
        (Object.prototype.toString.call(data_pid) === '[object Array]' ||
          Object.prototype.toString.call(data_pid) === '[object Object]') &&
        data_pid
      ) {
        return Promise.resolve(data_pid)
      }
      const d = await originalMethod.apply(descriptor, args)
      dataR.value.set(key, d)
      return data.get(key)
    }
    return descriptor
  }
}

export const ELLoading = () => {
  return (
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    const originalMethod = descriptor.value
    descriptor.value = async (...args: any[]) => {
      let d
      const loading = createElLoading()
      try {
        d = await originalMethod.apply(descriptor, args)
      } finally {
        loading.close()
      }
      return d
    }
    return descriptor
  }
}

export const ClearStoreCache = (...clears: Function[]): MethodDecorator => {
  return (
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    const originalMethod = descriptor.value
    descriptor.value = async (...args: any[]) => {
      for (const clear of clears) {
        clear()
      }
      const d = await originalMethod.apply(descriptor, args)
      return d
    }
    return descriptor
  }
}
