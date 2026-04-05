# EchoNote

## 🚀 はじめに

**EchoNote**は、AIとのやりとり(チャット)を記録してナレッジサービスのように管理するアプリケーションです。

---

## 🚀 コンセプト

AIを使って学習を進めているとき、過去にした質問と同じことがあります。
これをこのアプリをナレッジサービスのように検索して、似たような問題を解消しやすくするというものです。

---

## 🚀 概要

AI(Gemini等)とのやり取りを記録してナレッジサービスのように利用しやすくする。

---

## ✨ デモ動画

// TODO: ここに配置

---

## ✨ 主な機能

* AIとのやりとりを記録しておく機能
* 検索機能
* データのバックアップ・復元機能

## 📦 環境

* Windows 11以降

---

## 📦 技術スタック

* **フロントエンド**: React, Vite
* **画面遷移**: React Router
* **バックエンド (メインプロセス)**: Electron
* **言語**: TypeScript
* **データベース**: better-sqlite3
* **多言語化**: i18next, react-i18next
* **スタイル**: CSS Modules
* **テスト環境**: vitest, React Testing Library
* **Markdown機能**: DOMPurify, Marked

---

## 技術選定理由

RDBMSであるSQLite3を使いつつ、Web技術のコンポーネント指向で保守性を高めるためです。

---

## ⚙️ 開発環境のセットアップ

### Step0. Node.jsのインストール

Node.jsをインストールしておいてください。

### Step1. プロジェクトのclone

```shell
git clone https://github.com/Yor-Jihons/EchoNote.git
```

### Step2. installコマンドでパッケージの再現

```shell
npm install
```

### Step3. electron-rebuildを動かす

このステップが無いと「electronのバージョンの違い」によって動かなくなるため、ビルドしておく。

```shell
npx electron-rebuild
```

## 🚀 テスト方法

### Step1. テストの実行

#### Step1.1. 関数やクラスのテスト

```shell
npm run test
```

#### Step1.2. コンポーネントのテスト

```shell
npm run test:ui
```

---

## 🚀 ビルドとパッケージング

### 開発用ビルドを行う方法

#### Step1. 開発用の起動

```shell
npm run dev:electron
```

※ このコマンドを使う場合は別スレッドで行うこと。

### パッケージングを行う方法

#### Step1. `build:electron`コマンドを動かす

```shell
npm run build:electron
```

---

## IPC通信を追加する場合

1. `preload.ts`にIPC通信系を呼び出す処理
2. `src/@types/global.d.ts`で型を定義する
3. `src/api/ElectronApiClient.ts`に`preload.ts`で定義した関数をラップする

---


## ER図

<img src="./doc/echonote_er1.svg" alt="ER図">

---

## 🤝 実装予定の機能

* カスタムフックの利用
* 単体テスト

---

## 🤝 貢献とライセンス

This is under the MIT license. See also [the LICENSE file](./LICENSE).
