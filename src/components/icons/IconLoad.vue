<template>
    <svg
      class="loading-icon"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 100 100"
      xml:space="preserve"
    >
      <circle
        fill="none"
        stroke="#000"
        stroke-width="4"
        cx="50"
        cy="50"
        r="44"
        style="opacity: 0.5;"
      />
      <circle
        fill="#000"
        stroke="#e74c3c"
        stroke-width="3"
        cx="8"
        cy="54"
        r="6"
      >
        <animateTransform
          attributeName="transform"
          dur="2s"
          type="rotate"
          from="0 50 48"
          to="360 50 52"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  </template>
  
  <script>
  export default {
    name: "Icon-load"
  };
  </script>
  
  <style scoped>
  .loading-icon {
    width: 24px;
    height: 24px;
    animation: spin 2s linear infinite;
  }
  
  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
  </style>
  