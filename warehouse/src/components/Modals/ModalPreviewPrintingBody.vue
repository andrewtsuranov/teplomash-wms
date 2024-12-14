<template>
  <div class="modal fade"
       id="modalPreviewPrintingBody"
       aria-hidden="true"
       aria-labelledby="modalPreviewPrintingBodyLabel"
       data-bs-theme="dark"
       tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5"
              id="modalPreviewPrintingBodyLabel"
          >
            Предварительный просмотр этикетки
          </h1>
          <button type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
          >
          </button>
        </div>
        <div class="modal-body">
          Hide this modal and show the first with the button below.
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary"
                  data-bs-target="#modalPrintSettings"
                  data-bs-toggle="modal"
          >
            Назад
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
</script>
<style scoped>
</style>