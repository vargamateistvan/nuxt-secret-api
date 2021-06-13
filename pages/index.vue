<template>
  <div class="container">
    <div>
      <h1 class="title">
        Secrets
      </h1>
      Secret:
      <input v-model="secret" type="text" name="secret">
      Expire after view
      <input v-model="expireAfterViews" type="number" name="secret">
      Expire after
      <input v-model="expireAfter" type="number" name="secret">
      <button @click="createSecret">
        Create Secret
      </button>
      <!-- <div>
        {{ test }}
        <div class="links">
          <a
            href="/users"
            class="button--green"
          >
            Users List
          </a>
        </div>
      </div> -->
      <ul class="users">
        <li v-for="(secret, index) in secrets" :key="index" class="secret">
          <!-- <nuxt-link :to="{ name: 'users-id', params: { id: index }}"> -->
          {{ secret.hash }}
          <!-- </nuxt-link> -->
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData ({ $http }) {
    const test = await $http.$get('/api/test')
    return {
      test
    }
  },
  data: () => {
    return {
      secret: '',
      expireAfterViews: 1,
      expireAfter: 0,
      secrets: []
    }
  },
  methods: {
    async createSecret () {
      const request = { secret: this.secret, expireAfterViews: this.expireAfterViews, expireAfter: this.expireAfter }
      console.log('REQUEST', request)
      const result = await fetch('/api/secret', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(request)
      })
      const response = await result.json()
      console.log('RESPONSE', response)
      this.secrets.push(response)
    },
    getSecret () { }
  }
}
</script>

<style scoped>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
