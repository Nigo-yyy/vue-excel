<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <el-button type="primary">导入excel</el-button> -->
    <div class="control_wrap">
      <el-upload
        class="upload-demo"
        action=""
        :on-change="handleChange"
        :on-remove="handleRemove"
        :file-list="fileListUpload"
        :limit="1"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
        :auto-upload="false"
      >
        <el-tooltip content="只能上传xls/xlsx 文件" placement="top-start">
          <el-button style="margin-right: 20px" type="primary"
            >点击上传</el-button
          >
        </el-tooltip>
      </el-upload>
      <el-button type="warning" @click="getExcel(excelData)"
        >导出为excel</el-button
      >
    </div>
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <el-table
      v-if="excelData && excelData.length"
      :data="excelData"
      style="width: 95%; margin: 20px auto"
      border
    >
      <el-table-column
        v-for="(item, index) of colData"
        :key="index"
        :label="item.label"
      >
        <template slot-scope="scope">
          <span>{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// @ is an alias to /src
import { colData } from "@/utils/index";
export default {
  name: "Home",
  data() {
    return {
      excelData: [], //存放数据的数组
      fileListUpload: [], //upload绑定的fileList
      fileTemp: "", //导入函数需要的File内容
      colData: colData, //维护table列
    };
  },
  methods: {
    handleChange(file) {
      this.fileTemp = file.raw;
      if (this.fileTemp) {
        if (
          this.fileTemp.type ==
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          this.fileTemp.type == "application/vnd.ms-excel"
        ) {
          this.importfxx(this.fileTemp);
        } else {
          this.$message({
            type: "warning",
            message: "附件格式错误，请删除后重新上传！",
          });
          this.handleRemove();
        }
      } else {
        this.$message({
          type: "warning",
          message: "请上传附件！",
        });
      }
    },

    handleRemove() {
      this.fileTemp = null;
    },
    // 导入函数
    importfxx(obj) {
      // let _this = this;
      // 通过DOM取文件数据
      var rABS = false; //是否将文件读取为二进制字符串
      var f = obj;
      var reader = new FileReader();
      const self = this;
      //if (!FileReader.prototype.readAsBinaryString) {
      FileReader.prototype.readAsBinaryString = function (f) {
        var binary = "";
        // var pt = this;
        var wb; //读取完成的数据
        var outdata;
        var reader = new FileReader();
        reader.onload = function (e) {
          console.log(e);
          var bytes = new Uint8Array(reader.result);
          var length = bytes.byteLength;
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          var XLSX = require("xlsx");
          wb = XLSX.read(binary, {
            type: "binary",
          });
          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); //outdata就是需要的那个数组
          //   console.table(outdata);
          self.excelData = [...outdata];
        };
        reader.readAsArrayBuffer(f);
      };
      if (rABS) {
        reader.readAsArrayBuffer(f);
      } else {
        reader.readAsBinaryString(f);
      }
    },
    //导出函数
    getExcel(arrData) {
      if (!arrData || !arrData.length) return;
      require.ensure([], () => {
        const { export_json_to_excel } = require("../excel/expor2Excal");
        const filterVal = this.colData.map((item) => item.prop);
        const tHeader = this.colData.map((item) => item.label);
        const data = this.formatJson(filterVal, arrData);
        export_json_to_excel(tHeader, data, "excel表名");
      });
    },
    //保持输出顺序与表头一致
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
  },
};
</script>
<style lang="scss" scoped>
.home {
  .control_wrap {
    width: 100%;
    padding: 15px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    ::v-deep .el-upload-list {
      display: none;
    }
  }
}
</style>
