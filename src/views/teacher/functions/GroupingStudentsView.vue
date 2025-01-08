<script setup lang="ts">
import { createElNotificationSuccess } from '@/components/message'
import type { User } from '@/datasource/type'
import { exportGroupExcelFile } from '@/services/ExcelUtils'
import { TeacherService } from '@/services/TeacherService'
import { ref } from 'vue'

const studentsR = ref<User[]>([])
const studentsCount = computed(() => studentsR.value.length)
const updateStudentsR = ref<User[]>([])
const teachersR = ref<User[]>([])
const result = await Promise.all([
  TeacherService.listAllStudentsService(),
  TeacherService.listAllTeachersService()
])
studentsR.value = result[0]
teachersR.value = result[1]

//有1 2 3。。。多个组，全部学生最好要平均分配到这些个组里面，并且学生的导师和学生不能再同一group组里
let groupCount = 0
let allChooseGroup: number[] = []
teachersR.value.forEach((teacher) => {
  groupCount = Math.max(groupCount, teacher.groupNumber ?? 0)
})
for (let i = 1; i <= groupCount; i++) {
  allChooseGroup.push(i)
}
//根据教师找到教师所在的组并返回这个组以至于后面排除它进行分配
const cutTeacherGroup = (teacherName: string) => {
  let group = 0
  teachersR.value.forEach((teacher) => {
    if (teacher.name === teacherName) {
      if (teacher.groupNumber) {
        group = teacher.groupNumber
      }
    }
  })
  return group
}

let mapGroup = ref<Map<number, User[]>>(new Map())
//当前显示的组,默认显示第一组,字符串类型，为了和el-tabs的name(只能是字符串)对应，然后parseInt转换为数字
const currentShowGroup = ref<string>('0')

const groupStudentsF = () => {
  //事先清空mapGroup和updateStudentsR以便重新分配,并且重置chooseGroup
  mapGroup.value = new Map()
  for (let i = 1; i <= groupCount; i++) {
    mapGroup.value.set(i, [])
  }
  updateStudentsR.value = []
  //复制一份allChooseGroup，因为后面会删除chooseGroup中的元素
  let chooseGroup = [...allChooseGroup]

  //给学生打乱一下顺序
  studentsR.value = studentsR.value.sort(() => Math.random() - 0.5)

  studentsR.value.forEach((student) => {
    let chooseGroupCopy = [...chooseGroup]
    let group = cutTeacherGroup(student.student?.teacherName ?? '')
    chooseGroupCopy = chooseGroupCopy.filter((g) => g !== group)
    let groupNumber = chooseGroupCopy[Math.floor(Math.random() * chooseGroupCopy.length)]
    //有一种情况，就是除了该学生所在组之外的两个组，都大于所规定的最大学生数而被剔除了，那么这个groupNumber就会是undefined，所以导致已分配的学生数量不等于总共学生数量，这样我们不能让操作者提交
    let nowStudent = student
    if (groupNumber) {
      nowStudent = {
        number: student.number,
        groupNumber: groupNumber,
        name: student.name,
        student: {
          ...student.student,
          queueNumber: (mapGroup.value.get(groupNumber)?.length ?? 0) + 1
        }
      }
      updateStudentsR.value.push(nowStudent)
      mapGroup.value.get(groupNumber)?.push(nowStudent)
      //向上取整：Math.ceil()，向下取整：Math.floor()，四舍五入：Math.round()
      //如果某个组的学生数等于总学生数除以组数，那么就从chooseGroupCopy中暂时删除这个组
      if (
        (mapGroup.value.get(groupNumber)?.length ?? 0) > Math.ceil(studentsCount.value / groupCount)
      ) {
        chooseGroup = chooseGroup.filter((g) => g !== groupNumber)
      }
    }
  })
}

const GroupTeachersStudentsCount = (groupNum: number) => {
  const result: { teacherName: string; count: number }[] = []

  mapGroup.value.get(groupNum)?.forEach((student) => {
    const teacherName = student.student?.teacherName
    const index = result.findIndex((r) => r.teacherName === teacherName)
    if (index === -1) {
      result.push({
        teacherName: teacherName ?? '',
        count: 1
      })
    } else {
      result[index].count++
    }
  })
  return result
}

const submitF = async () => {
  await TeacherService.updateStudentsService(updateStudentsR.value)
  createElNotificationSuccess('分组成功')
}
const downloadF = () => {
  const data: [any[]][] = []
  for (let i = 1; i <= groupCount; i++) {
    data.push([[]])
  }
  studentsR.value.forEach((student) => {
    data[(student.groupNumber ?? 0) - 1][0].push({
      number: student.number,
      name: student.name,
      teacherName: student.student?.teacherName,
      queueNumber: student.student?.queueNumber,
      projectTitle: student.student?.projectTitle
    })
  })
  exportGroupExcelFile(data as unknown as Map<number, any[]>, '学生分组表格')
}
</script>
<template>
  <div>
    <p>
      <el-button type="primary" @click="groupStudentsF">分组</el-button>
      <el-button :disabled="studentsCount != updateStudentsR.length" @click="submitF"
        >提交</el-button
      >
      <el-button type="success" @click="downloadF">导出学生分组表格</el-button>
    </p>
    <p>总学生数量:{{ studentsCount }}---已分配学生数量:{{ updateStudentsR.length }}</p>
    <p>第一组学生数量{{ mapGroup.get(1)?.length }}</p>
    <p>第二组学生数量{{ mapGroup.get(2)?.length }}</p>
    <p>第三组学生数量{{ mapGroup.get(3)?.length }}</p>
  </div>
  <div>
    <el-tabs v-model="currentShowGroup">
      <p>
        <el-tag
          v-for="(t, index) in GroupTeachersStudentsCount(parseInt(currentShowGroup))"
          :key="index"
          style="margin-right: 10px"
        >
          {{ t.teacherName }}-{{ t.count }}
        </el-tag>
      </p>
      <el-tab-pane label="第一组" name="1">
        <template v-for="(s, index) in mapGroup.get(1)" :key="index">
          {{ index + 1 }}-{{ s.name }}-{{ s.student?.teacherName }} <br />
        </template>
      </el-tab-pane>
      <el-tab-pane label="第二组" name="2">
        <template v-for="(s, index) in mapGroup.get(2)" :key="index">
          {{ index + 1 }}-{{ s.name }}-{{ s.student?.teacherName }} <br />
        </template>
      </el-tab-pane>
      <el-tab-pane label="第三组" name="3">
        <template v-for="(s, index) in mapGroup.get(3)" :key="index">
          {{ index + 1 }}-{{ s.name }}-{{ s.student?.teacherName }} <br />
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
