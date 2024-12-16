<script setup lang="ts">
import { PA_REVIEW } from '@/datasource/const'
import type {
  LevelCount,
  Process,
  ProcessScore,
  PSDetailTeacher,
  StudentProcessScore,
  User
} from '@/datasource/type'
import { CommonService } from '@/services'
import { TeacherService } from '@/services/TeacherService'
import { useUserStore } from '@/stores/UserStore'
import { defineAsyncComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import GroupTeachersView from './GroupTeachersView.vue'
const params = useRoute().params as { pid: string; auth: string }
const userS = useUserStore().userS
const result = await Promise.all([
  params.auth == PA_REVIEW
    ? TeacherService.listGroupStudentsService()
    : TeacherService.listTutorStudentsService(),
  TeacherService.listProcessesProcessScoresService(params.pid, params.auth),
  CommonService.listProcessesService()
  // TeacherService.listProcessFilesService(params.pid, params.auth)
])
const studentsS = ref<User[]>()
const processscoresS = ref<ProcessScore[]>()
const processesS = ref<Process[]>()
// const processFilesS = ref<ProcessFile[]>()
studentsS.value = result[0]
processscoresS.value = result[1]
processesS.value = result[2]
// processFilesS.value = result[3]

const levelCount = ref<LevelCount>({
  score_last: 0,
  score_60: 0,
  score_70: 0,
  score_80: 0,
  score_90: 0,
  len: studentsS.value!.length
})

const studentprocessscore = ref<StudentProcessScore[]>()
collectPS(processscoresS.value!)
// 聚合评分数据
function collectPS(psS: ProcessScore[]) {
  levelCount.value = {
    score_last: 0,
    score_60: 0,
    score_70: 0,
    score_80: 0,
    score_90: 0,
    len: studentsS.value!.length
  }

  studentprocessscore.value = []
  studentsS.value?.forEach((student) => {
    const studentps: StudentProcessScore = {}
    //创建一个与原始对象完全独立的副本，避免对原始对象的意外修改影响到其他地方使用该对象
    studentps.student = student

    studentprocessscore.value!.push(studentps)

    let temp = 0
    studentps.psTeachers = []
    studentps.averageScore = temp
    const thisStudentThisProcessPS = psS.filter((ps) => ps.studentId == studentps.student?.id)
    if (!thisStudentThisProcessPS) return
    thisStudentThisProcessPS.forEach((tstpPS) => {
      const psDetail = tstpPS.detail!
      psDetail.score && (temp += psDetail.score)
      const PSDTeacher: PSDetailTeacher = {
        processScoreId: tstpPS.id,
        teacherId: tstpPS.teacherId,
        teacherName: tstpPS.detail?.teacherName,
        score: tstpPS.detail?.score,
        detail: psDetail.detail
      }
      studentps.psTeachers?.push(PSDTeacher)

      if (!userS.value) {
        console.log('userS:{}', userS.value)
        return
      }
      if (tstpPS.teacherId == userS.value.id) {
        studentps.currentTeacherScore = psDetail.score
      }
    })
    studentps.psTeachers.length > 0 && (studentps.averageScore = temp / studentps.psTeachers.length)
    studentps.averageScore = Math.round(studentps.averageScore)

    if (studentps.averageScore >= 90) {
      levelCount.value.score_90++
    } else if (studentps.averageScore >= 80 && studentps.averageScore < 90) {
      levelCount.value.score_80++
    } else if (studentps.averageScore >= 70 && studentps.averageScore < 80) {
      levelCount.value.score_70++
    } else if (studentps.averageScore >= 60 && studentps.averageScore < 70) {
      levelCount.value.score_60++
    } else if (studentps.averageScore < 60) {
      levelCount.value.score_last++
    }
  })
}

const addProcessScoreF = (ps: ProcessScore) => {
  TeacherService.addProcessScoreService(params.pid, params.auth, ps).then((psS) => collectPS(psS!))
}

// --------------------
// 附件

// const studentAttaches = processesS.value.find((ps) => ps.id == params.id)?.attach
// const processFileC = computed(
//   () => (sid: string, number: number) =>
//     processFilesS.value!.find((pf) => pf.studentId == sid && pf.number == number)
// )

// const clickAttachF = async (sid: string, number: number) => {
//   const pname = processFilesS.value!.find(
//     (pf) => pf.studentId == sid && pf.number == number
//   )?.detail
//   pname && (await TeacherService.getProcessFilesService(pname))
// }

// --------------------
// 评分
const gradingDialog = defineAsyncComponent(() => import('./GradingDialog.vue'))
const currentStudentR = ref<StudentProcessScore>()

const gradingDialogVisable = ref(false)
const gradeF = (s: StudentProcessScore) => {
  gradingDialogVisable.value = true
  currentStudentR.value = s
}
// 传给子组件
const closeF = () => (gradingDialogVisable.value = false)
</script>
<template>
  <div>
    <GroupTeachersView />
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
    <el-table :data="studentprocessscore">
      <el-table-column type="index" label="#" width="50" />
      <el-table-column min-width="220">
        <template #default="scope">
          <el-text type="primary" size="large">
            {{ (scope.row as StudentProcessScore).student?.name }}
          </el-text>
          <br />
          {{ (scope.row as StudentProcessScore).student?.student?.teacherName }}
          <br />
          {{ (scope.row as StudentProcessScore).student?.student?.projectTitle }}
        </template>
      </el-table-column>
      <!--
      <el-table-column label="附件">
        <template #default="scope">
          <template v-for="(attach, index) of studentAttaches" :key="index">
            <el-button
              :icon="attach.number == 1 ? Box : Brush"
              :color="attach.number == 1 ? '#409EFF' : '#626aef'"
              style="margin-bottom: 5px"
              @click="clickAttachF((scope.row as StudentProcessScore).student?.id!, attach.number!)"
              v-if="processFileC((scope.row as StudentProcessScore).student?.id!, attach.number!)"
            >
              {{ attach.name }}
            </el-button>
            <br />
          </template>
        </template>
      </el-table-column>
    -->
      <el-table-column label="评分/平均分">
        <template #default="scope">
          {{ scope.row.currentTeacherScore }} /
          <el-text type="primary" size="large">{{ scope.row.averageScore }}</el-text>
          <br />
          <span v-for="(t, index) of scope.row.psTeachers" :key="index">
            {{ t.teacherName }};
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="90">
        <template #default="scope">
          <el-button type="primary" @click="gradeF(scope.row as StudentProcessScore)">
            评分
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <gradingDialog
    v-if="gradingDialogVisable"
    :student="currentStudentR!"
    :close="closeF"
    :add-process-score="addProcessScoreF"
    :processId="params.pid"
  />
</template>
