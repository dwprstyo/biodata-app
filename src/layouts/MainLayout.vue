<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-grey-8" bordered>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          :icon="drawerToggleIcon"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-space />

        <q-btn-dropdown flat round>
          <template v-slot:label>
            <q-avatar>
              <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-black.svg" />
            </q-avatar>
          </template>
          <q-list>
            <q-item clickable v-close-popup @click="logout">
              <q-item-section>
                <q-item-label>Logout</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :mini="miniState" :width="250">
      <div class="row items-center q-pa-md">
        <q-icon name="biotech" size="md" />
        <div v-if="!miniState" class="text-h6 text-weight-bold q-ml-sm">Biodata App</div>
      </div>
      <q-separator />
      <q-list>
        <q-item clickable to="/" exact active-class="text-primary">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Dashboard</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/members" active-class="text-primary">
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Members</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const $api = inject('api')
const router = useRouter()

const leftDrawerOpen = ref(false)
const miniState = ref(false)

const drawerToggleIcon = computed(() => {
  if ($q.screen.gt.sm) {
    return miniState.value === true ? 'chevron_right' : 'chevron_left'
  }
  return leftDrawerOpen.value === true ? 'chevron_left' : 'chevron_right'
})

function toggleLeftDrawer() {
  if ($q.screen.gt.sm) {
    miniState.value = !miniState.value
  } else {
    leftDrawerOpen.value = !leftDrawerOpen.value
  }
}

const logout = () => {
  localStorage.removeItem('token')
  delete $api.defaults.headers.common.Authorization
  router.push('/auth/login')
  $q.notify({
    message: 'You have been logged out.',
    color: 'positive',
    icon: 'check_circle',
  })
}
</script>
