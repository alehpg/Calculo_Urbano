export default {
 
    env: {
      node: true,   // Define o ambiente Node.js
      es2021: true, // Define o suporte para ES2021
    },
    extends: 'eslint:recommended', // Usa as recomendações do ESLint
    parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': 'warn',    // Avisos para variáveis não utilizadas
      'quotes': ['error', 'double'], // Força o uso de aspas duplas
      'indent': ['error', 4],        // Usa indentação de 4 espaços
    },
  };
  
