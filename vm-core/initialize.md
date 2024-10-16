# How initialized

## 1. `npx create-next-app@latest app --typescript`

```sh
√ Would you like to use ESLint? ... No / "Yes"
√ Would you like to use Tailwind CSS? ... No / "Yes"
√ Would you like to use `src/` directory? ... No / "Yes"
√ Would you like to use App Router? (recommended) ... No / "Yes"
√ Would you like to customize the default import alias (@/*)? ... "No" / Yes
Creating a new Next.js app in

Using npm.

Initializing project with template: app-tw


Installing dependencies:
- react
- react-dom
- next

Installing devDependencies:
- typescript
- @types/node
- @types/react
- @types/react-dom
- postcss
- tailwindcss
- eslint
- eslint-config-next

...

found 0 vulnerabilities
Success! Created app at
```

## 2. Add files

```txt
app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── users/
│   │   │       └── route.ts  # ユーザー関連のAPIエンドポイント
│   │   ├── components/
│   │   │   └── UserList.tsx  # ユーザーリストを表示するReactコンポーネント
│   │   ├── layout.tsx        # アプリケーション全体のレイアウト
│   │   └── page.tsx          # メインページのコンポーネント（App Router）
│   ├── pages/
│   │   └── hoge.tsx          # 追加のページコンポーネント（Pages Router）
│   ├── libs/
│   │   └── redis.ts          # Redisクライアントの設定と接続関数
│   └── types/
│       └── index.ts          # TypeScript型定義ファイル
├── public/                   # 静的ファイル用ディレクトリ
├── package.json              # プロジェクトの依存関係とスクリプト
└── tsconfig.json             # TypeScript設定ファイル
```
