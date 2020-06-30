<template>
  <div class="login-container">
    <div class="login-bar">
      <i class="logo-icon"></i>
    </div>
    <div class="login-content">
      <p class="pan-intro-box">
        <span class="pan-intro first-line">Yourpan</span>
        <span class="pan-intro">您的<i class="intro-red">得力</i>云助手</span>
        <img class="small-icon" src="./imgs/bg_content.svg" alt="small-icon">
      </p>
      <div class="login-box">
        <div class="login-title-box">登录账号</div>
        <el-form
          class="rule-form"
          :model="ruleForm"
          status-icon
          ref="ruleForm">
          <el-form-item
            prop="identity"
            :rules="[{ required: true, message: '请输入您的账号或者邮箱', trigger: ['blur', 'change']}]">
            <el-input
              prefix-icon="el-icon-user"
              class="text-input"
              v-model="ruleForm.identity"
              placeholder="在此输入您的账号或者邮箱">
            </el-input>
          </el-form-item>
          <el-form-item
            prop="password"
            :rules="[{ required: true, message: '请输入密码', trigger: ['blur', 'change']}]">
            <el-input
              prefix-icon="el-icon-lock"
              class="text-input"
              v-model="ruleForm.password"
              placeholder="在此输入您的密码">
            </el-input>
          </el-form-item>
          <el-form-item class="save-password">
            <el-checkbox v-model="savePassword">记住密码</el-checkbox>
          </el-form-item>
          <el-form-item class="submit-btn">
            <el-button class="login-btn" size="small" @click="handleSubmit">登录</el-button>
          </el-form-item>
        </el-form>
        <p class="login-register" @click="goToRegister">免费注册</p>
      </div>
    </div>
  </div>
</template>

<script>
  import API from '@api/login';
  import { setToken } from '@common/publicSource/auth';
  export default {
    name: "login",
    data () {
      return {
        savePassword: false,
        ruleForm: {
          identity: '',
          password: ''
        }
      }
    },
    methods: {
      handleSubmit () {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.$service.post(API.loginSubmit, this.ruleForm)
              .then(res => {
                this.handleSavePassword(res.data.token);
                this.toHome();
              }, err => {});
          } else {
            return false;
          }
        });
      },
      goToRegister () {
        this.$router.push({
          path: '/regist'
        });
      },
      toHome () {
        this.$router.push({
          path: '/home'
        });
      },
      handleSavePassword (token) {
        this.savePassword && setToken(token);
      }
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  // 滚动动画
  @keyframes dy{
    from { width: 0; }
    to { width: 100%; }
  }
  .login-container {
    height: 100vh;
    background: rgba(238, 238, 238, 0.1) url("./imgs/bg_icon.png") 0 90px no-repeat;
    background-size: cover;
    img {
      display: block;
      max-width: 100%;
    }
    .login-bar {
      height: 60px;
      box-shadow: 1px 0 10px rgba(204,204,204, 0.4);
      background: linear-gradient(to right, rgba(238, 238, 238,.1), rgba(238, 238, 238,.3));
      .logo-icon {
        display: block;
        height: 100%;
        width: 170px;
        background: url("./imgs/logo-justify.png") no-repeat;
        background-size: cover;
      }
    }
    .login-content {
      height: calc(100vh - 60px);
      width: 80%;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-around;
      .pan-intro-box {
        min-width: 450px;
        width: 45%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .pan-intro {
          display: block;
          font-size: 24px;
          text-align: center;
          width: 0;
          white-space:nowrap;
          overflow:hidden;
          animation: dy 1.5s steps(50, end) 1.2s forwards;
          line-height: 1.5;
          &.first-line {
            animation: dy 1.5s steps(50, end) forwards;
            font-size: 40px;
            &::first-letter {
              color: #f00;
              font-size: 46px;
            }
          }
          .intro-red {
            color: #f00;
            font-weight: bold;
            padding: 0 5px;
            font-size: 28px;
          }
        }
        .small-icon {
          margin-top: 50px;
          width: 80%;
        }
      }
      .login-box {
        min-height: 300px;
        width: 350px;
        border-radius: 5px;
        border: 1px solid #C9D1DD;
        background-color: #fff;
        box-shadow: 0 3px 11px 0 rgba(146, 166, 192, 0.15);
        box-sizing: border-box;
        .login-title-box {
          padding: 17px 31px;
          border-bottom: 1px solid rgba(197, 208, 224, 0.2);
          color: #2c7df1;
          font-size: 18px;
          text-align: center;
          letter-spacing: 2px;
        }
        .rule-form {
          padding: 30px;
          box-sizing: border-box;
          .login-btn {
            width: 100%;
            height: 44px;
            line-height: 1;
            color: #fff;
            text-align: center;
            border-radius: 4px;
            background: #2c7df1;
            cursor: pointer;
            font-size: 16px;
            border: none;
            outline: none;
          }
          .save-password {
            /deep/ .el-form-item__content {
              line-height: 1;
            }
          }
        }
        .login-register {
          padding: 0 30px;
          box-sizing: border-box;
          text-align: right;
          height: 44px;
          line-height:44px;
          background: #F8F8F8;
          color: #f00;
          cursor: pointer;
          text-decoration: underline;
          border-radius: 0 0 4px 4px;
        }
      }
    }
  }
</style>
