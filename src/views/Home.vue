<template>
  <div class="home">
  </div>
</template>

<script lang="ts">
import electron from 'electron';
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Home extends Vue {
  public electron = electron;
  protected mounted() {
    console.log(this);
  }
}
</script>
