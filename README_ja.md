![simple-chat-webui-for-dify](public/readme/sample.png)
このプロジェクトは、Dify用のNext.js製の非常にシンプルなウェブUIです。
レスポンシブルで、スマートフォンにも対応しています。

プログラミング勉強中なのであまり期待しないでください :P

## Getting Started

### .env の設定
スクリーンショットを参考に、最低限、以下の２項目の設定を行ってください。
```
DIFY_APP_API_BASE_URL=https://xxxxx.xxxx.xxx/v1
DIFY_APP_API_KEY=app-XXXXXXXXXXXXXX
```
![api_screen_shot](public/readme/api.png)

### ローカルで実行
以下の２ステップで起動できます。
```
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) をブラウザで開いて確認してください。

## カスタマイズ
.env でカスタマイズすることができます
![customize](public/readme/customize.png)

## BASIC認証
```
AUTH_MODE="BASIC"
BASIC_AUTH_USER="basic_user"
BASIC_AUTH_PASSWORD="basic_pass"
```
`AUTH_MODE`を`BASIC`にすることで、BASIC認証をかけることができます。
認証が不要な場合は、空に設定してください。

## Deploy on Vercel
Server-Sent Events を使用しているので、Vercel でも動きます。
ただし、無料プランでは時間の制限により、チャットが途中で途切れてしまうことがあります。

## Dify 開発チームへの心からの感謝
素晴らしアプリを開発してくださり、誠にありがとうございます。
心から感謝申し上げます。