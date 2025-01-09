require('dotenv').config();

const { writeFileSync, mkdirSync } = require('fs');

const targetPath = `./src/environments/environments.ts`;

const envFileContent = `
export const enviroment = {
  base_url: "${process.env.BASE_URL}"
};
`;

mkdirSync('./src/environments', { recursive: true });

writeFileSync( targetPath, envFileContent );
