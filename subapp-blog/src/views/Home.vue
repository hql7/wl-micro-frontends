<template>
  <div class="report-home">
    <h4>表单</h4>
    <WlForm />
  </div>
</template>

<script>
// @ is an alias to /src
import WlForm from "@/components/wl-form.vue";

export default {
  name: "report-home",
  components: {
    WlForm
  }
};
</script>
