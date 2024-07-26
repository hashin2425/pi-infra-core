# React + TypeScript + Next.js プロジェクトセットアップガイド

このガイドでは、React + TypeScript + Tailwind CSS + SCSS + Next.js を使用して Web サイトを作成し、GitHub Actions でビルドして GitHub Pages にデプロイする手順を説明します。

## 1. プロジェクトの作成

新しい Next.js プロジェクトを作成します。ターミナルで以下のコマンドを実行します：

```bash
npx create-next-app@latest my-website --typescript
```

プロンプトに対して以下のように回答してください：

- Would you like to use ESLint? › Yes
- Would you like to use Tailwind CSS? › Yes
- Would you like to use `src/` directory? › Yes
- Would you like to use App Router? (recommended) › Yes
- Would you like to customize the default import alias? › No

## 2. 依存関係のインストール

プロジェクトディレクトリに移動し、必要な依存関係をインストールします：

```bash
cd my-website
npm install sass
```

## 3. ディレクトリ構成

プロジェクトのディレクトリ構成は以下のようになります：

```
my-website/
│
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   └── images/
├── src/
│   ├── app/
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── styles/
│       ├── globals.scss
│       └── Home.module.scss
├── .gitignore
├── next.config.js
├── package.json
├── README.md
├── tailwind.config.js
└── tsconfig.json
```

## 4. ページの作成

### src/app/page.tsx (Homepage):

```tsx
import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to My Website</h1>
      <p className="text-lg">This is the homepage of my awesome website.</p>
    </div>
  );
};

export default HomePage;
```

### src/app/about/page.tsx:

```tsx
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-4">About Us</h1>
      <p className="text-lg">Learn more about our company and mission.</p>
    </div>
  );
};

export default AboutPage;
```

### src/app/contact/page.tsx:

```tsx
import React from 'react';

const ContactPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
      <p className="text-lg">Get in touch with us for any inquiries.</p>
    </div>
  );
};

export default ContactPage;
```

## 5. レイアウトの作成

src/app/layout.tsx ファイルを編集して、共通のレイアウトを作成します：

```tsx
import React from 'react';
import '../styles/globals.scss';

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <header className="bg-blue-500 text-white p-4">
          <nav>
            <ul className="flex space-x-4">
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="bg-gray-200 p-4 mt-8">
          <p>&copy; 2024 My Website. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
};

export default RootLayout;
```

## 6. スタイルの設定

src/styles/globals.scss ファイルを編集して、グローバルスタイルを設定します：

```scss
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

// カスタムスタイルをここに追加
body {
  font-family: 'Arial', sans-serif;
}
```

## 7. GitHub Actions の設定

.github/workflows/deploy.yml ファイルを作成し、以下の内容を追加します：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout
      uses: actions/checkout@v2

    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm ci

    - name: Build
      run: npm run build

    - name: Export
      run: npm run export

    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./out
```

## 8. next.config.js の設定

next.config.js ファイルを編集して、GitHub Pages での動作に必要な設定を追加します：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/your-repo-name' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/your-repo-name' : '',
}

module.exports = nextConfig
```

注意: 'your-repo-name'をあなたの GitHub リポジトリ名に置き換えてください。

## 9. package.json の更新

package.json ファイルの scripts セクションに以下の行を追加します：

```json
"scripts": {
  // ... 他のスクリプト
  "export": "next export"
}
```

## 10. GitHub リポジトリの設定

1. GitHub で新しいリポジトリを作成します。
2. ローカルプロジェクトをこのリポジトリにプッシュします。
3. リポジトリの設定で、GitHub Pages を有効にし、ソースを gh-pages ブランチに設定します。

これで、React + TypeScript + Tailwind CSS + SCSS + Next.js を使用した Web サイトのセットアップが完了し、GitHub Actions を使用して GitHub Pages にデプロイする準備が整いました。main ブランチにプッシュするたびに、自動的にビルドとデプロイが行われます。

このセットアップでは、Tailwind CSS と SCSS を組み合わせて使用できます。Tailwind CSS はユーティリティファーストのアプローチを提供し、SCSS はより複雑なカスタムスタイルを記述するのに役立ちます。
