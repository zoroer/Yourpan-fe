<template>
  <div class="login-container">
    <div class="login-bar">
      <i class="logo-icon"></i>
      <p class="to-login">
        已有账号？请<span class="login-text" @click="toLogin">点击登录 ></span>
      </p>
    </div>
    <div class="regist-container">
      <div class="regist-box">
        <div class="step-box">
          <p :class="[stepNow > 1 && 'success', 'active', 'step-list']">
            <span class="step-index">1</span>
            <span class="step-title">填写注册信息</span>
            <span class="step-border"></span>
          </p>
          <p :class="[stepNow >= 2 && 'active', stepNow > 2 && 'success', 'step-list']">
            <span class="step-index">2</span>
            <span class="step-title">注册成功</span>
            <span class="step-border"></span>
          </p>
        </div>
        <div class="common-content regist-content" v-if="stepNow === 1">
          <p class="regist-title">免费，注册试用！</p>
          <el-form
            class="rule-form"
            :model="ruleForm"
            status-icon
            ref="ruleForm">
            <el-form-item
              prop="userName"
              :rules="[{ required: true, message: '请输入您的账号', trigger: ['blur', 'change']}]">
              <el-input
                prefix-icon="el-icon-user"
                class="text-input"
                v-model="ruleForm.userName"
                placeholder="在此输入您的账号">
              </el-input>
            </el-form-item>
            <el-form-item
              prop="email"
              :rules="[{ required: true, message: '请输入邮箱', trigger: ['blur', 'change']}]">
              <el-input
                prefix-icon="el-icon-message"
                class="text-input"
                v-model="ruleForm.email"
                placeholder="在此输入您的邮箱">
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
            <el-form-item
              prop="password_again"
              :rules="[{ required: true, message: '请再次输入密码', trigger: ['blur', 'change']}]">
              <el-input
                prefix-icon="el-icon-lock"
                class="text-input"
                v-model="ruleForm.password_again"
                placeholder="在此再次输入您的密码">
              </el-input>
            </el-form-item>
            <el-form-item
              class="captcha-item"
              prop="captcha_value"
              :rules="[{ required: true, message: '请输入验证码', trigger: ['blur', 'change']}]">
              <el-input
                prefix-icon="el-icon-warning-outline"
                class="text-input verify-input"
                v-model="ruleForm.captcha_value"
                placeholder="在此输入右侧的验证码">
                <template slot="append">
                  <img class="verify-img" :src="verifyImgUrl" alt="verifyImg">
                </template>
              </el-input>
            </el-form-item>
            <el-form-item class="submit-btn">
              <el-button class="login-btn" size="small" @click="handleSubmit">注册账号</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="common-content regist-success" v-else>
          <p class="regist-title success">恭喜您，<span class="title-success">注册成功！</span></p>
          <div class="success-content">
            <img class="content-icon" src="./imgs/small-icon1.png" alt="icon">
            <div class="success-text">
              <p class="success-text-list">
                欢迎您使用
                <span class="red-text">Yourpan</span>
              </p>
              <p class="success-text-list">
                <span>跳转网盘首页中<i class="dot"></i></span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "register",
    data () {
      return {
        stepNow: 1,
        verifyImgUrl: require('./imgs/reg.png'),
        ruleForm: {
          userName: '',
          email: '',
          password: "",
          password_again: "",
          captcha_id: "",
          captcha_value: ""
        }
      }
    },
    methods: {
      handleSubmit () {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.stepNow = 3;
          } else {
            return false;
          }
        });
      },
      toLogin () {
        this.$router.push({
          path: '/login'
        });
      }
    }
  }
</script>

<style lang="less" type="text/less" scoped>
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      .logo-icon {
        display: block;
        height: 100%;
        width: 170px;
        background: url("./imgs/logo-justify.png") no-repeat;
        background-size: cover;
      }
      .to-login {
        color: #929CA9;
        font-size: 14px;
        padding-right: 30px;
        .login-text {
          color: #2C7DF1;
          text-decoration: underline;
          cursor: pointer;
          font-size: 15px;
          margin-left: 8px;
        }
      }
    }
    .regist-container {
      height: calc(100vh - 60px);
      width: 90%;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      .regist-box {
        min-height: 550px;
        width: 800px;
        border-radius: 5px;
        background-color: #fff;
        box-shadow: 1px 1px 6px 1px #ccc;
        box-sizing: border-box;
        .step-box {
          display: flex;
          align-items: center;
          .step-list {
            position: relative;
            width: 50%;
            padding: 25px 0;
            text-align: center;
            &.active {
              .step-index {
                color: #2C7DF1;
                border-color: #2C7DF1;
              }
              .step-title {
                color: #2C7DF1;
              }
              .step-border {
                background: linear-gradient(to right, #2C7DF1, #F5F7F9);
              }
            }
            &.success {
              .step-border {
                background: #2C7DF1;
              }
            }
            .step-index {
              display: inline-block;
              width: 24px;
              height: 24px;
              text-align: center;
              line-height: 24px;
              border: 2px solid #F5F7F9;
              border-radius: 50%;
              color: #C6CDD7;
              font-size: 16px;
            }
            .step-title {
              padding-left: 10px;
              color: #C6CDD7;
            }
            .step-border {
              position: absolute;
              left: 0;
              bottom: 0;
              width: 100%;
              height: 2px;
              background: #F5F7F9;
            }
          }
        }
        .common-content {
          padding: 40px;
          box-sizing: border-box;
          text-align: center;
          .regist-title {
            font-size: 28px;
            color: #050F28;
            margin-bottom: 35px;
            font-weight: bold;
            &.success {
              font-weight: normal;
              .title-success {
                color: rgba(255, 0, 0, 0.7);
                font-weight: bold;
              }
            }
          }
        }
        .regist-content {
          .rule-form {
            width: 50%;
            margin: 0 auto;
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
            .captcha-item {
              /deep/ .el-input-group__append {
                width: 50px;
              }
            }
            .verify-input {
              .verify-img {
                position: absolute;
                top: 0;
                right: 0;
              }
            }
          }
        }
        .regist-success {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .success-content {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 80%;
            margin-top: 6%;
            .content-icon {
              width: 150px;
            }
            .success-text {
              margin-left: 20%;
              .success-text-list {
                font-size: 20px;
                margin-bottom: 35px;
                color: #2C7DF1;
                .red-text {
                  color: rgba(255, 0, 0, 0.7);
                  font-size: 32px;
                }
                .dot {
                  height: 18px;
                  width: 28px;
                  overflow: hidden;
                  display: inline-block;
                  vertical-align: middle;
                  text-align: left;
                }
                .dot::after {
                  display: inline-block;
                  white-space: pre-wrap;
                  font-weight: bold;
                  content: '.\A..\A...\A....\A.....';
                  animation: animate 2s steps(5) infinite;
                }
                /* dot loading 动画 */
                @keyframes animate {
                  from { transform: translateY(0); }
                  to { transform: translateY(-100%); }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
