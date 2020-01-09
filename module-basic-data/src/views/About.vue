<template>
  <div class="basic-calendar">
    <h4>日历</h4>
    <WlCalendar></WlCalendar>
  </div>
</template>

<script>
import WlCalendar from "@/components/wl-calendar.vue";

export default {
  name: "basic-calendar",
  components: { WlCalendar }
};
</script>