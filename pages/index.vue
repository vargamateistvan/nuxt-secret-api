<template>
  <div>
    <v-form>
      <v-container>
        <v-row no-gutters>
          <v-col>
            Secret: <v-text-field v-model="secretText" type="text" label="Secret text" />
          </v-col>
          <v-col>
            Expire after view <v-text-field v-model="expireAfterViews" required type="number" min="1" />
          </v-col>
          <v-col>
            Expire after <v-text-field v-model="expireAfter" required type="number" min="0" />
          </v-col>
          <v-col>
            <v-btn @click="createSecret">
              Create Secret
            </v-btn>
          </v-col>
          <v-col>
            <v-btn @click="getAllSecret">
              Refresh list
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>

    <v-container>
      <v-simple-table>
        <template #default>
          <thead>
            <tr>
              <th class="text-left">
                Hash
              </th>
              <th class="text-left">
                Expire at
              </th>
              <th class="text-left">
                Remaing view
              </th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(currentSecret, index) in secrets" :key="index">
              <td>{{ currentSecret.hash }}</td>
              <td>{{ currentSecret.expiresAt > 0 ? new Date(currentSecret.expiresAt) : 'No time limit' }}</td>
              <td>{{ currentSecret.remainingViews }}</td>
              <td>
                <v-btn @click="getSecret(currentSecret.hash)">
                  Check Secret
                </v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-container>

    <v-snackbar v-model="notification.visible" :color="notification.color">
      {{ notification.text }}
      <template #action="{ attrs }">
        <v-btn text v-bind="attrs" @click="notification.visible = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { get, post } from '../utils/request'

export default {
  data: () => {
    return {
      secretText: '',
      expireAfterViews: '1',
      expireAfter: '0',
      secrets: [],
      valid: false,
      notification: {
        visible: false,
        text: '',
        color: ''
      }
    }
  },
  created () {
    this.getAllSecret()
  },
  methods: {
    async createSecret () {
      const request = {
        secretText: this.secretText,
        expireAfterViews: this.expireAfterViews,
        expireAfter: this.expireAfter
      }

      const response = await post('http://localhost:3000/api/secret', request)
      if (response.error) { return this.showNotification(response.error, 'error') }
      this.showNotification('Success request', 'success')
      this.getAllSecret()
    },
    async getSecret (hash) {
      const response = await get(`http://localhost:3000/api/secret/${hash}`)
      if (response.error) { return this.showNotification(response.error, 'error') }
      this.showNotification('Success request', 'success')
      this.getAllSecret()
    },
    async getAllSecret () {
      const response = await get('http://localhost:3000/api/secrets')
      if (response.error) { return this.showNotification(response.error, 'error') }
      this.showNotification('Success request', 'success')
      this.secrets = response.data
    },
    showNotification (message, color) {
      this.notification.visible = true
      this.notification.text = message
      this.notification.color = color
    }
  }
}
</script>
