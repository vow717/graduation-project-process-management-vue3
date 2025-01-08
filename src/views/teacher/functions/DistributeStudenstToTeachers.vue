<script setup lang="ts">
import { createElNotificationSuccess } from '@/components/message'
import type { User } from '@/datasource/type'
import { exportStudentsExcelFile } from '@/services/ExcelUtils'
import { TeacherService } from '@/services/TeacherService'
import { ref } from 'vue'
//方便展示各老师的分配结果
interface TeacherTemp {
  id?: string
  name?: string
  total?: number
  A?: number
  B?: number
  C?: number
  levelA?: User[]
  levelB?: User[]
  levelC?: User[]
}
const allStudentsR = ref<User[]>([])
const allTeachersR = ref<User[]>([]) //所有老师
const updateStudentsR = ref<User[]>([]) //更新后的学生列表
const teachersR = ref<TeacherTemp[]>([]) //老师分配结果

const results = await Promise.all([
  TeacherService.listAllTeachersService(),
  TeacherService.listAllStudentsService()
])
allStudentsR.value = results[1]
allTeachersR.value = results[0]

let totalA = 0
let totalB = 0
let totalC = 0

allTeachersR.value.forEach((teacher) => {
  totalA += teacher.teacher?.A ?? 0
  totalB += teacher.teacher?.B ?? 0
  totalC += teacher.teacher?.C ?? 0
  const teacherTemp: TeacherTemp = {
    id: teacher.id,
    name: teacher.name,
    total: teacher.teacher?.total,
    A: teacher.teacher?.A,
    B: teacher.teacher?.B,
    C: teacher.teacher?.C,
    //这里是各级学生的list
    levelA: [],
    levelB: [],
    levelC: []
  }
  teachersR.value.push(teacherTemp)
})

const studentsA = allStudentsR.value!.slice(0, totalA)
const studentsB = allStudentsR.value!.slice(totalA, totalA + totalB)
const studentsC = allStudentsR.value!.slice(totalA + totalB, totalA + totalB + totalC)

const distributeF = (students: User[], level: 'A' | 'B' | 'C') => {
  //复制一份老师列表,用这个列表来分配学生，一旦老师的A/B/C的学生分配完毕，就从这个列表中删除
  const teachersTemp = [...teachersR.value.filter((t) => (t[level] ?? 0) > 0)]

  const teachersTempCopy = [...teachersTemp]
  students.forEach((student) => {
    //随机选择一个老师
    const teacherIndex = Math.floor(Math.random() * teachersTempCopy.length)
    const teacher = teachersTempCopy[teacherIndex]

    teacher[`level${level}`]?.push(student)

    teachersTempCopy.splice(teacherIndex, 1)
    //如果这个老师的A/B/C的学生已经分配完毕，从teachersTemp中删除这个老师,因为这个老师已经分配完毕
    if (teacher[`level${level}`]?.length === teacher[level]) {
      teachersTemp.splice(
        teachersTemp.findIndex((t) => t.id === teacher.id),
        1
      )
    }
    if (teachersTempCopy.length === 0) {
      teachersTempCopy.push(...teachersTemp) //如果所有老师的A/B/C的学生都分配完毕，就重新复制一份老师列表
    }
  })
}
const allDistributeF = () => {
  teachersR.value.forEach((teacher) => {
    teacher.levelA = []
    teacher.levelB = []
    teacher.levelC = []
  })
  distributeF(studentsA, 'A')
  distributeF(studentsB, 'B')
  distributeF(studentsC, 'C')
}

const submitF = async () => {
  teachersR.value.forEach((teacher) => {
    teacher.levelA?.forEach((student) => {
      updateStudentsR.value.push({
        name: student.name,
        number: student.number,
        student: { teacherId: teacher.id, teacherName: teacher.name }
      })
    })
    teacher.levelB?.forEach((student) => {
      updateStudentsR.value.push({
        name: student.name,
        number: student.number,
        student: { teacherId: teacher.id, teacherName: teacher.name }
      })
    })
    teacher.levelC?.forEach((student) => {
      updateStudentsR.value.push({
        name: student.name,
        number: student.number,
        student: { teacherId: teacher.id, teacherName: teacher.name }
      })
    })
  })
  await TeacherService.updateStudentsService(updateStudentsR.value)
  createElNotificationSuccess('学生分配提交成功')
}

const downloadF = () => {
  exportStudentsExcelFile(allStudentsR.value, '学生-老师分配结果')
}
</script>
<template>
  <el-button type="primary" @click="allDistributeF"> 随机分配</el-button>
  <el-button type="success" @click="submitF">提交</el-button>
  <el-button type="success" @click="downloadF" :disabled="allStudentsR.length === 0">
    导出学生-老师分配结果
  </el-button>
  <div>
    <div v-for="teacher in teachersR" :key="teacher.id">
      <p>{{ teacher.name }}/{{ teacher.total }}</p>
      <p>
        LevelA: <span v-for="(s, index) in teacher.levelA" :key="index">{{ s.name }};</span> LevelB:
        <span v-for="(s, index) in teacher.levelB" :key="index">{{ s.name }};</span> LevelC:
        <span v-for="(s, index) in teacher.levelC" :key="index">{{ s.name }};</span>
      </p>
    </div>
  </div>
</template>
