# 앱 권한 최소허용 연구소

초등 학습자가 가상 앱의 기능과 권한 요청을 비교하고, 필요한 권한만 선택하는 연습을 하는 React·Vite 학습 모델입니다. 실제 기기 권한이나 네트워크 요청을 사용하지 않으며, 학습 근거와 진행 상태는 브라우저의 로컬 저장 범위에서만 다룹니다.

## 공개 학습 앱

<https://wbmaker2.github.io/minimum-permission-lab/>

## 로컬 실행

```bash
npm ci
npm run dev
```

개발 서버가 안내한 주소를 브라우저에서 여십시오.

## 검증 명령

```bash
npm run lint
npm run test:run
npm run test:coverage
npm run build
npm run test:e2e
```

정책 검사는 `npm run test:policy`와 `npm run check:policy`로 별도로 실행할 수 있습니다. Playwright 브라우저 검증은 `e2e/`에 있으며, 화면 읽기 프로그램의 실제 음성 출력 확인은 수동 검증 항목으로 관리합니다.

## 배포

`main`에 푸시하거나 GitHub Actions에서 `Build and deploy to GitHub Pages`를 수동 실행하면 lint, 정책·단위 테스트, production build가 통과한 뒤 GitHub Pages에 배포됩니다. 워크플로 파일은 `.github/workflows/deploy-pages.yml`입니다.

## 학습·안전 범위

- 모든 사례는 가상 기능·가상 권한·가상 데이터 흐름으로 구성됩니다.
- 브라우저 권한 API, 외부 네트워크, 분석 도구를 호출하지 않습니다.
- 학습자가 입력하는 근거는 개인정보를 넣지 않는다는 안내와 함께 선택적으로 로컬에 저장될 수 있습니다.
- 앱 안의 `업데이트 내역` 버튼에서 앱 개발일과 개선 기록을 확인할 수 있습니다.
