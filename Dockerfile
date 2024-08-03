# Node.js 이미지를 기반으로 설정합니다.
FROM node:14

# 애플리케이션 폴더를 작업 디렉토리로 설정합니다.
WORKDIR /app

# package.json과 package-lock.json 파일을 복사합니다.
COPY package*.json ./

# 종속성을 설치합니다.
RUN npm install

# 애플리케이션 소스 코드를 복사합니다.
COPY . .

# 애플리케이션을 빌드합니다.
RUN npm run build

# 애플리케이션이 실행될 포트를 노출합니다.
EXPOSE 8080

# 기본 명령어는 프로덕션 모드로 설정합니다.
CMD ["npm", "run", "start:prod"]
