import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginReact from 'eslint-plugin-react'

/** @type {import('eslint').Linter.Config} */
export default {
	files: ['**/*.{js,mjs,cjs,jsx}'], // 대상 파일 패턴 설정
	languageOptions: {
		globals: globals.browser, // 브라우저 환경 전역 변수 사용
	},
	extends: [
		'airbnb-base', // Airbnb 스타일 가이드
		'prettier', // Prettier와 호환
		pluginJs.configs.recommended, // 기본 JavaScript 추천 규칙
		pluginReact.configs.flat.recommended, // React 추천 규칙
	],
	rules: {
		// 추가 규칙 설정 (필요 시)
	},
	env: {
		node: true, // Node.js 환경
		commonjs: true, // CommonJS 환경
		es2021: true, // ES2021 지원
	},
}
