<template>
  <div class="min-h-screen commingSoon-wrapper">

    <div class="justify-center d-flex image">
      <img class="mx-auto" src="@/assets/logo_white.png" alt="logo-white">
    </div>
    <div>
      <h1>COMMING SOON</h1>
      <h4>WE ARE BUILDING THINGS AMAZING FOR YOU</h4>
    </div>
  </div>
</template>

<script>

</script>

<style lang="scss" scoped>
.commingSoon-wrapper{
  background: hsla(350, 97%, 65%, 1);
  background: radial-gradient(circle, #693b43 0%, #420a43 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;

  h1, h4 {
    margin-top: 0;
    color: white;
        font-weight: 500;
  }

  h1 {
    font-size: 30pt;
    margin-bottom: 1.5rem;
  }

  h4 {
    font-size: 16pt;
  }
  .image {
    margin-bottom: 2rem;
    img {
      width: 30%;
    }
  }
}
</style>
