<template>
  <button
    @click="copyToClipboard"
    class="px-3 py-1.5 rounded transition-bg duration-200 font-mono text-sm"
    :style="buttonStyle"
    title="Copy formatted JSON"
  >
    {{ buttonText }}
  </button>
</template>

<script>
export default {
  name: 'CopyButton',
  props: {
    jsonData: {
      type: [Object, Array, String, Number, Boolean],
      default: null
    }
  },
  data() {
    return {
      copied: false
    }
  },
  computed: {
    buttonText() {
      return this.copied ? 'Copied!' : 'Copy JSON'
    },
    buttonStyle() {
      if (this.copied) {
        return {
          backgroundColor: '#2d5a2d',
          color: '#afcfa4',
          border: '1px solid #afcfa4'
        }
      }
      return {
        backgroundColor: '#2d2d2d',
        color: '#d4d4d4',
        border: '1px solid #555',
        cursor: 'pointer'
      }
    }
  },
  methods: {
    async copyToClipboard() {
      try {
        const jsonString = JSON.stringify(this.jsonData, null, 2)
        await navigator.clipboard.writeText(jsonString)
        this.copied = true
        setTimeout(() => {
          this.copied = false
        }, 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }
}
</script>

<style scoped>
button:hover {
  background-color: #3d3d3d !important;
}
</style>
