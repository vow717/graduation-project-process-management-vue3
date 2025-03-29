import SparkMD5 from 'spark-md5'

// 切完片，要进行 hash 计算
// 首先我们考虑，怎么样去区分一个不同的文件呢？首先文件名字肯定是不行的，因为文件名是可以修改的。我们可以考虑文件的内容，文件的内容是不会变的。我们可以对文件进行 hash 计算，计算出一个 hash 值，这个 hash 值就是这个文件的唯一标识符。
// 我们可以使用 md5 算法来计算文件的 hash 值。md5 算法是一个常用的 hash 算法，可以将任意长度的数据转换为一个 hash 值。我们可以使用 spartk-md5 这个库来计算文件的 hash 值。
// import SparkMD5 from 'spark-md5'
// 借助这个 hash 值，我们还可以实现秒传输的功能。我们可以先计算出文件的 hash 值，然后将 hash 值传给后端，后端根据 hash 值判断这个文件是否已经存在，如果存在就直接不用处理上传请求了，给用户的感觉就好像是秒传了一样。

// e是一个事件对象，包含了事件的相关信息。e.data是一个对象，包含了我们传递给 worker 的数据。我们可以通过 e.data 来获取我们传递的数据。
self.onmessage = async (e: MessageEvent<{ chunks: Blob[] }>) => {
  const { chunks } = e.data //解构出 chunks

  // 考虑到文件可能会很大，不能用全部的数据来计算 hash 值，那么我们可以只用文件的前面，中间，后面各 2 个字节来计算 hash 值。这样就可以大大减少计算 hash 值的时间了。
  // 第一个和最后一个切片参与计算，而中间的切片只计算前面，中间，后面各 2 个字节
  try {
    const targets: Blob[] = [] // 存储所有参与计算的切片
    chunks.forEach((chunk, index) => {
      if (index === 0 || index === chunks.length - 1) {
        targets.push(chunk)
      } else {
        targets.push(chunk.slice(0, 2))
        targets.push(chunk.slice(chunk.size - 2))
        targets.push(chunk.slice(chunk.size / 2 - 2, chunk.size / 2 + 2))
      }
    })
    const spark = new SparkMD5.ArrayBuffer()
    const reader = new FileReader()

    //分块读取优化
    const processChunk = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        reader.onload = (e) => {
          spark.append(e.target?.result as ArrayBuffer)
          resolve()
        }
        reader.readAsArrayBuffer(targets[index])
      })
    }
    for (let i = 0; i < targets.length; i++) {
      await processChunk(i)
    }
    self.postMessage({ hash: spark.end() }) // 计算完成后，发送 hash 值
  } catch (error: any) {
    self.postMessage({ error: error.message }) // 计算失败后，发送错误信息
  }
}
