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
          <p :class="[registerStep > 1 && 'success', 'active', 'step-list']">
            <span class="step-index">1</span>
            <span class="step-title">填写注册信息</span>
            <span class="step-border"></span>
          </p>
          <p :class="[registerStep > 1 && 'success active', 'step-list']">
            <span class="step-index">2</span>
            <span class="step-title">注册成功</span>
            <span class="step-border"></span>
          </p>
        </div>
        <div class="common-content regist-content" v-if="registerStep === 1">
          <p class="regist-title">免费，注册试用！</p>
          <el-form
            class="rule-form"
            :model="ruleForm"
            status-icon
            ref="ruleForm">
            <el-form-item
              prop="email"
              :rules="[{ required: true, validator: validatorEmail, trigger: ['blur', 'change']}]">
              <el-input
                prefix-icon="el-icon-message"
                class="text-input"
                v-model="ruleForm.email"
                placeholder="在此输入您的邮箱">
              </el-input>
            </el-form-item>
            <el-form-item
              prop="userName"
              :rules="[{ required: true, message: '请输入您的账号', trigger: ['blur', 'change']}]">
              <el-tooltip class="item" effect="dark" content="账号不超过16个字符" placement="top-start">
                <el-input
                  maxlength="16"
                  prefix-icon="el-icon-user"
                  class="text-input"
                  v-model="ruleForm.userName"
                  placeholder="在此输入您的账号">
                </el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item
              prop="password"
              :rules="[{ required: true, message: '请输入密码', trigger: ['blur', 'change']}]">
              <el-tooltip class="item" effect="dark" content="密码不超过16个字符" placement="top-start">
                <el-input
                  type="password"
                  maxlength="16"
                  prefix-icon="el-icon-lock"
                  class="text-input"
                  v-model="ruleForm.password"
                  auto-complete="new-password"
                  :show-password="true"
                  placeholder="在此输入您的密码">
                </el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item
              prop="password_again"
              :rules="[{ required: true, validator: validatorPasswordAgain, trigger: ['blur', 'change']}]">
              <el-input
                type="password"
                maxlength="16"
                prefix-icon="el-icon-lock"
                class="text-input"
                :show-password="true"
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
  const sha1 = require('sha1');
  import API from '@api/regist';
  export default {
    name: "register",
    data () {
      return {
        // 1 注册中 2 注册完成
        registerStep: 1,
        verifyImgUrl: '',
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
      validatorEmail (rule, value, cb) {
        const mailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if (value === '') {
          cb(new Error('请输入邮箱'))
        } else if (!mailReg.test(value)) {
          cb(new Error('邮箱不合法'))
        } else {
          cb()
        }
      },
      validatorPasswordAgain (rule, value, cb) {
        if (value === '') {
          cb(new Error('请再次输入密码'))
        } else if (value !== this.ruleForm.password) {
          cb(new Error('两次输入的密码不一致，请检查后重新输入'))
        } else {
          cb()
        }
      },
      handleSubmit () {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.ruleForm.password = sha1(this.ruleForm.password);
            this.ruleForm.password_again = sha1(this.ruleForm.password_again);
            this.$service.post(API.registerSubmit, this.ruleForm)
              .then(res => {
                this.registerStep = 2;
              }, err => {});
          } else {
            return false;
          }
        });
      },
      toLogin () {
        this.$router.push({
          path: '/login'
        });
      },
      toHome () {
        this.$router.push({
          path: '/home'
        });
      },
      getVerifyCode () {
        this.$service.get(API.getVerifyCode)
          .then(res => {
            this.verifyImgUrl = res.data.captcha_image;
            this.ruleForm.captcha_id = res.data.captcha_id;
          }, err => {});
      }
    },
    created() {
      this.getVerifyCode();
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  .login-container {
    height: 100vh;
    background: rgba(238, 238, 238, 0.1) url("./imgs/bg_icon.png") 0 90px no-repeat;
    background-size: cover;
    min-width: 1120px;
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
