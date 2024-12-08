# 毕设管理系统前端

## 基础功能

所有用户登录操作。  
用户默认账号密码均为学号/工号。  
为保证安全，登录时检测到账号密码为默认值会要求修改密码，可忽略。  
登录后基于角色展示不同功能组件。

## 过程

毕设由若干过程组成(开题答辩/期中检查/毕业答辩/毕设演示)，每过程包含不同评分占比，以及针对不同学生(导师指导学生/组内学生)。 不同专业/届可能有不同数据，因此由专业动态录入。  
每过程应包括

过程子项。过程由若干子项组成，子项包含占比。例如，开题答辩由选题依据50%+设计方案25%+答辩25%组成。  
学生附属项。过程允许包含若干学生附属项。例如，需要开题/毕业答辩需要学生上传ppt以及文档。
其他隐形属性。  
过程不支持评分，过程应至少包含一个过程子项。

## 角色功能

### 超级管理员

独立角色，无导师操作权限。  
创建专业，导入包含指导数量/工号等信息的专业教师表格。

### 导师

不包含秘书/主任等角色，所有导师教师具有相同操作权限。  
针对不同过程/过程子项，对学生评分。包括例如中期的指导学生及组内学生。

基本功能

创建过程，过程子项等  
导入学生表格  
按数量等自动分配导师  
将学生随机分组/答辩顺序。分组原则，学生与指导教师不在同组，各组学生数尽量平均。  
导入覆盖毕设题目/分组/顺序/导师等信息  
重置指定账号密码  
更新用户信息。支持修改导师/分组等。  
导出详细评分表格  
展示组内过程学生文件

### 学生

按学生附属项要求，上传文档。

## 2024-10-31 学习装饰器Decorators

## 2024-11-6 安装自动导入库和vue组件的工具

减少手动导入的繁琐,具体作用自己网上查看
npm install unplugin-auto-import --save-dev
npm install unplugin-vue-components --save-dev
编写auto-imports.d.ts和components.d.ts

压缩资源工具：
npm install vite-plugin-compression2
