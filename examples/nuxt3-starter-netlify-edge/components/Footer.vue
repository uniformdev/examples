<template>
  <footer class="footer">
    <div class="footer-content">
      <span>Powered by</span>
      <a href="https://uniform.dev" target="_blank" rel="noopener noreferrer">
        <Logo width="220" />
      </a>
    </div>
    <div class="uniform-buttons">
      <ForgetMe />
    </div>
  </footer>
</template>

<style scoped>
.footer {
  display: flex;
  flex-direction: column;
  padding: 2rem 0;
  border-top: 1px solid #eaeaea;
  justify-content: center;
  align-items: center;
  margin-top: auto;
}

.footer-content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.uniform-buttons {
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: auto;
}
</style>
