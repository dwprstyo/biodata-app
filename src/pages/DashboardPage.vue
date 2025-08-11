<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6 col-md-4">
          <q-card
            class="my-card text-white"
            style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
          >
            <q-card-section>
              <div class="text-h6">Total Members</div>
              <div class="text-subtitle2">All registered members</div>
            </q-card-section>

            <q-card-section class="q-pt-none text-h2 text-weight-bold">
              {{ totalMembers }}
            </q-card-section>

            <q-card-actions>
              <q-btn flat to="/members">View Members</q-btn>
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/api'
import apiEndpoints from 'src/api'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const totalMembers = ref(0)
const fetchMembers = async () => {
  try {
    const response = await api.get(apiEndpoints.members.getAll)
    totalMembers.value = response.data.data.data.length
  } catch (error) {
    console.error('Failed to fetch members:', error)
    $q.notify({ color: 'negative', message: 'Failed to load data.' })
  }
}

onMounted(() => {
  fetchMembers()
})
</script>
