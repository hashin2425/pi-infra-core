# pi-infra-core

自宅サーバーのコア機能を支えるコード

[![CodeQL](https://github.com/hashin2425/pi-infra-core/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/hashin2425/pi-infra-core/actions/workflows/github-code-scanning/codeql) [![Dependabot Updates](https://github.com/hashin2425/pi-infra-core/actions/workflows/dependabot/dependabot-updates/badge.svg)](https://github.com/hashin2425/pi-infra-core/actions/workflows/dependabot/dependabot-updates) [![DEPLOY API FRONT - Deploy api front to Azure Functions](https://github.com/hashin2425/pi-infra-core/actions/workflows/deploy-api-front.yml/badge.svg)](https://github.com/hashin2425/pi-infra-core/actions/workflows/deploy-api-front.yml) [![DEPLOY API GATEWAY - Deploy api gateway to Azure Functions](https://github.com/hashin2425/pi-infra-core/actions/workflows/deploy-api-gateway.yml/badge.svg)](https://github.com/hashin2425/pi-infra-core/actions/workflows/deploy-api-gateway.yml) [![DEPLOY GH FRONT - Deploy gh front to GitHub Pages](https://github.com/hashin2425/pi-infra-core/actions/workflows/deploy-gh-front.yml/badge.svg)](https://github.com/hashin2425/pi-infra-core/actions/workflows/deploy-gh-front.yml) [![DEPLOY WEB BACKEND - Deploy web backend to Azure Web App](https://github.com/hashin2425/pi-infra-core/actions/workflows/deploy-web-backend.yml/badge.svg)](https://github.com/hashin2425/pi-infra-core/actions/workflows/deploy-web-backend.yml) [![pages-build-deployment](https://github.com/hashin2425/pi-infra-core/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/hashin2425/pi-infra-core/actions/workflows/pages/pages-build-deployment)

```mermaid
flowchart LR
    A[Raspberry Pi 4]-->B[Azure Functions]
    A-->D[Discordなど]
    A-->G[LAN]
    B-->C[GitHub Pages]
    D-->|ログなど|F[管理者]
    C-->|デバイス情報|F
    G-->|ファイル操作など|F
```

## `core`

サーバー上で稼働するコード

## `docs`

GitHub Pages で公開するための Web フロントエンド

## `api-front`

Web フロントエンドからサーバー情報を取得するための API

## `gateway`

サーバーからクラウドに対してデバイス情報を送信するための API

## コミットプレフィックス

- `feature`：新しい機能の追加
- `fix`：不具合の修正
- `docs`：ドキュメントやコメントの変更
- `style`：フォーマットの変更
- `refactor`：コードの整理
- `optimize`：アルゴリズムの最適化
- `test`：テストなどの整備
- `init`：初期コミットなど
- `chore`：その他
