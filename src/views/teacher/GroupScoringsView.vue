<script setup lang="ts">
import type { LevelCount, Process, ProcessScore, User } from '@/datasource/type'
import { CommonService } from '@/services'
import { TeacherService } from '@/services/TeacherService'
import { computed, ref } from 'vue'

interface StudentScore {
  student?: User
  totalScore: number
  scores?: { process?: Process; score?: number }[]
}
/*
当Promise.all被调用时，它会立即开始并行地执行传入的所有Promise对象。
每个Promise对象都会独立地进行异步操作，例如发送网络请求、读取文件等。
Promise.all会监听所有这些Promise的状态变化。
*/
const result = await Promise.all([
  CommonService.listProcessesService(),
  TeacherService.listProcessScoresGroupService(),
  TeacherService.listGroupStudentsService()
])
const processes = ref<Process[]>()
const processScores = ref<ProcessScore[]>()
const students = ref<User[]>()
processes.value = result[0]
processScores.value = result[1]
students.value = result[2]

const studentsScores: StudentScore[] = []
const levelCount: LevelCount = {
  score_last: 0,
  score_60: 0,
  score_70: 0,
  score_80: 0,
  score_90: 0,
  len: students.value?.length!
}
students.value?.forEach((stu) => {
  const stuProcessScore: StudentScore = { student: stu, scores: [], totalScore: 0 }
  studentsScores.push(stuProcessScore)

  // 获取当前学生当前过程的全部评分
  let currentProcessScore = 0
  processes.value?.forEach((p) => {
    const stuProcessAllScores = processScores.value!.filter(
      (ps) => ps.processId == p.id && ps.studentId == stu.id
    )
    let pScore = 0
    stuProcessAllScores.forEach((sps) => {
      pScore += sps.detail?.score ?? 0
    })
    stuProcessAllScores.length > 0 && (pScore = pScore / stuProcessAllScores.length)
    pScore = Math.round(pScore)
    stuProcessScore.scores?.push({ process: p, score: pScore })
    currentProcessScore += pScore * p.point! * 0.01
  })
  stuProcessScore.totalScore = Math.round((stuProcessScore.totalScore += currentProcessScore))
  if (stuProcessScore.totalScore >= 90) {
    levelCount.score_90++
  } else if (stuProcessScore.totalScore >= 80 && stuProcessScore.totalScore < 90) {
    levelCount.score_80++
  } else if (stuProcessScore.totalScore >= 70 && stuProcessScore.totalScore < 80) {
    levelCount.score_70++
  } else if (stuProcessScore.totalScore >= 60 && stuProcessScore.totalScore < 70) {
    levelCount.score_60++
  } else if (stuProcessScore.totalScore < 60) {
    levelCount.score_last++
  }
})
// 按照总成绩对studentsScores数组进行降序排序。
studentsScores.sort((x, y) => y.totalScore - x.totalScore)

//
const processTitleC = computed(() => (pro: Process) => `${pro.name}${pro.point}%`)

//
const stuProcessScoreC = computed(
  () => (scores: { process?: Process; score?: number }[], pid: string) =>
    scores.find((sc) => sc.process?.id == pid)?.score
)
</script>
<template>
  <el-row class="my-row">
    <el-col>
      <div>
        优秀
        <el-tag>{{ levelCount.score_90 }}</el-tag>
        ； 良好
        <el-tag>{{ levelCount.score_80 }}</el-tag>
        ； 中等
        <el-tag>{{ levelCount.score_70 }}</el-tag>
        ； 及格
        <el-tag>{{ levelCount.score_60 }}</el-tag>
        ； 不及格
        <el-tag>{{ levelCount.score_last }}</el-tag>
        ； 共
        <el-tag>{{ levelCount.len }}</el-tag>
      </div>
    </el-col>
    <el-col>
      <el-table :data="studentsScores">
        <el-table-column type="index" label="#" width="50" />
        <el-table-column min-width="200">
          <template #default="scope">
            <el-text type="primary" size="large">
              {{ (scope.row as StudentScore).student?.name }}
            </el-text>
            <br />
            {{ (scope.row as StudentScore).student?.student?.teacherName }}
            <br />
            {{ (scope.row as StudentScore).student?.student?.projectTitle }}
          </template>
        </el-table-column>
        <el-table-column v-for="(pro, index) of processes" :key="index" :label="processTitleC(pro)">
          <template #default="scope">
            {{ stuProcessScoreC((scope.row as StudentScore).scores!, pro.id!) }}
          </template>
        </el-table-column>

        <el-table-column label="总成绩">
          <template #default="scope">
            {{ (scope.row as StudentScore).totalScore }}
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>
