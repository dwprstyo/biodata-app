<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table title="Biodata" :rows="biodata" :columns="columns" row-key="id" :filter="filter">
        <template v-slot:top>
          <div class="text-h6">Data Biodata</div>
          <q-space />
          <q-input dense debounce="300" color="primary" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-btn
            color="primary"
            icon="add"
            label="New Biodata"
            @click="openAddDialog"
            class="q-ml-md"
          />
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn dense round flat icon="edit" @click="openEditDialog(props.row)"></q-btn>
            <q-btn dense round flat icon="delete" @click="deleteRow(props.row)"></q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Dialog for Add/Edit -->
    <q-dialog v-model="dialogVisible" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ isEditing ? 'Edit Biodata' : 'Add New Biodata' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit.prevent="saveData" class="q-gutter-md">
            <q-input
              dense
              v-model="formData.name"
              label="Name"
              autofocus
              :rules="[(val) => !!val || 'Name is required']"
            />
            <q-input
              dense
              v-model="formData.email"
              label="Email Address"
              type="email"
              :rules="[(val) => !!val || 'Email is required']"
            />
            <q-input dense v-model="formData.phone" label="Phone" />
            <q-input dense v-model="formData.address" label="Address" type="textarea" />
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Save" @click="saveData" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/api'
import apiEndpoints from 'src/api'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const columns = [
  { name: 'name', required: true, label: 'Name', align: 'left', field: 'name', sortable: true },
  { name: 'email', label: 'Email Address', align: 'left', field: 'email', sortable: true },
  { name: 'phone', label: 'Phone', align: 'left', field: 'phone' },
  { name: 'address', label: 'Address', align: 'left', field: 'address' },
  { name: 'actions', label: 'Actions', align: 'center' },
]

const biodata = ref([])

const fetchMembers = async () => {
  try {
    const response = await api.get(apiEndpoints.members.getAll)
    console.log(response.data.data.data)

    biodata.value = response.data.data.data
  } catch (error) {
    console.error('Failed to fetch members:', error)
    $q.notify({ color: 'negative', message: 'Failed to load data.' })
  }
}

const filter = ref('')
const dialogVisible = ref(false)
const formData = ref({})
const isEditing = ref(false)

const openAddDialog = () => {
  isEditing.value = false
  formData.value = {}
  dialogVisible.value = true
}

const openEditDialog = (row) => {
  isEditing.value = true
  formData.value = { ...row }
  dialogVisible.value = true
}

const saveData = async () => {
  if (!formData.value.name || !formData.value.email) {
    $q.notify({
      color: 'negative',
      message: 'Name and Email are required fields.',
      icon: 'warning',
    })
    return
  }

  try {
    if (isEditing.value) {
      await api.put(apiEndpoints.members.update(formData.value.id), formData.value)
    } else {
      await api.post(apiEndpoints.members.create, formData.value)
    }

    dialogVisible.value = false
    $q.notify({
      color: 'positive',
      message: `Data successfully ${isEditing.value ? 'updated' : 'added'}.`,
      icon: 'check',
    })

    await fetchMembers()
  } catch (error) {
    console.error('Failed to save data:', error)
    $q.notify({ color: 'negative', message: 'Failed to save data.' })
  }
}

const deleteRow = (row) => {
  $q.dialog({
    title: 'Confirm',
    message: `Are you sure you want to delete ${row.name}?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await api.delete(apiEndpoints.members.delete(row.id))
      $q.notify({ color: 'positive', message: 'Data deleted successfully.' })
      await fetchMembers()
    } catch (error) {
      console.error('Failed to delete data:', error)
      $q.notify({ color: 'negative', message: 'Failed to delete data.' })
    }
  })
}

onMounted(() => {
  fetchMembers()
})
</script>
