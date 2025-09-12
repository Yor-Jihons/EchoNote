# EchoNote

  * **主な機能**
  * **技術スタック**
  * **開発環境のセットアップ方法**
  * **ビルドと実行**
  * **ライセンス**

## 🚀 はじめに

このテンプレートプロジェクトはElectron + Viteのプロジェクトを簡単に作成するためのものです。言語はTypeScriptとしています。

---

## ✨ 主な機能

* AIとのやりとりを記録しておく機能
* 検索機能
* データのバックアップ・復元機能

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
* **Markdown機能**: DOMPurify

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

## 🤝 貢献とライセンス

This is under the MIT license. See also [the LICENSE file](./LICENSE).
