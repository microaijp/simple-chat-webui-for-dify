# ベースイメージとして Node.js 20 を使用
FROM node:20

# 作業ディレクトリを作成
WORKDIR /app

# パッケージファイルをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションコードをコピー
COPY . .

# ビルド
RUN npm run build


# 環境変数設定
ENV NODE_ENV production

# ポートの指定
EXPOSE 3000

# 実行コマンド
CMD ["npm", "start"]
