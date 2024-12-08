import type { Teacher, User } from '@/datasource/type'
import * as XLSX from 'xlsx'

//admin存储老师信息
export function readTeacherFile(file: Blob) {
  return new Promise<User[]>((resolve) => {
    const reader = new FileReader()
    const teachers: User[] = []

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const data = e.target?.result
      const wb = XLSX.read(data, { type: 'binary' })
      const sheet = wb.Sheets[wb.SheetNames[0]]
      XLSX.utils.sheet_to_json(sheet).forEach((row: any) => {
        const teacher: Teacher = {
          total: row['数量'],
          A: row['A组'],
          B: row['数量'] - row['A组'] - row['C组'],
          C: row['C组']
        }
        teachers.push({
          name: row['姓名'],
          number: row['账号'].toString(),
          groupNumber: row['组'],
          teacher: teacher
        })
      })
    }
    reader.onloadend = () => {
      resolve(teachers)
    }
    reader.readAsArrayBuffer(file)
  })
}

//读取按成绩依次排名的学生信息
export function readStudentForSelectionFile(file: Blob) {
  return new Promise<User[]>((resolve) => {
    const reader = new FileReader()
    const students: User[] = []

    // e: ProgressEvent<FileReader>是一个事件对象，包含了读取文件的进度信息，通过这个对象可以获取到文件的内容
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const data = e.target?.result
      //以二进制（{ type: 'binary' }）的方式对获取到的文件内容进行解析，将其转换为一个工作簿（workbook）对象 wb，这个对象代表了整个 Excel 文件的结构和数据。
      const wb = XLSX.read(data, { type: 'binary' })
      //从工作簿对象中获取第一个工作表（Sheet）对象，通常情况下，如果 Excel 文件中只有一个学生信息表，那么获取第一个工作表就是我们要处理的数据所在的地方。如果有多个工作表，可以根据实际需求修改索引或者通过其他方式确定要处理的具体工作表。
      const sheet = wb.Sheets[wb.SheetNames[0]]
      XLSX.utils.sheet_to_json(sheet).forEach((row: any) => {
        students.push({
          name: row['姓名'],
          number: row['账号'].toString()
        })
      })
    }
    reader.onloadend = () => {
      resolve(students)
    }
    reader.readAsArrayBuffer(file)
  })
}