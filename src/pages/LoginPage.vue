<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="q-pa-md shadow-2 my-card" bordered>
      <q-card-section class="text-center">
        <div class="text-grey-9 text-h5 text-weight-bold">Sign In</div>
        <div class="text-grey-8">Sign in below to access your account</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <q-input
            dense
            outlined
            v-model="email"
            label="Email"
            type="email"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Please type your email']"
          />

          <q-input
            dense
            outlined
            type="password"
            v-model="password"
            label="Password"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Please type your password']"
          />

          <div>
            <q-btn label="Login" type="submit" color="primary" class="full-width" />
          </div>
        </q-form>
      </q-card-section>

      <q-card-section class="text-center q-pt-none">
        <div class="text-grey-8">
          Don't have an account yet?
          <a href="#" class="text-dark text-weight-bold" style="text-decoration: none">Sign up.</a>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
defineOptions({
  name: 'LoginPage',
})
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import apiEndpoints from 'src/api'
import { api } from 'src/boot/api'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const router = useRouter()

const email = ref(null)
const password = ref(null)

const onSubmit = async () => {
  try {
    const response = await api.post(apiEndpoints.auth.login, {
      email: email.value,
      password: password.value,
    })

    const token = response.data.access_token
    console.log(response.data)

    localStorage.setItem('token', token)
    api.defaults.headers.common.Authorization = `Bearer ${token}`
    $q.notify({
      type: 'positive',
      message: 'Login successful!',
    })
    router.push('/')
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Login failed. Please check your credentials.',
    })
    console.log(error)
  }
}
</script>

<style scoped>
.my-card {
  width: 100%;
  max-width: 400px;
  border-radius: 20px;
}
</style>
