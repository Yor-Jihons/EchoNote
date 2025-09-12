//import { useState, useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';
//import { useTranslation } from 'react-i18next';
import styles from "./mainpage.module.css";

function MainPage() {
  return (
    <>
      <h1 className={styles.header1}>EchNote</h1>
      <p>
        EchoNoteは、AIとのやりとり(チャット)を記録してナレッジサービスのように管理するアプリケーションです。
      </p>

      <div>
        <h2>定義</h2>
        <ul>
          <li><span className={styles.def_name}>チャット</span>: AIとのやりとり全体</li>
          <li><span className={styles.def_name}>メッセージ</span>: やりとり中の一つのコメント</li>
        </ul>
      </div>

      <div>
        <h2>使い方</h2>

        <h3>チャットの追加</h3>
        <ol type="1">
          <li>左にある「チャットの追加」をクリック</li>
          <li>チャット名とAIの種類を入力</li>
          <li>「追加」をクリック</li>
        </ol>

        <h3>チャットの削除</h3>
        <ol type="1">
          <li>左にあるチャット一覧から選び、マウスを動かすと「削除」ボタンが出るのでそれをクリック</li>
        </ol>
      </div>
    </>
  );
}

export default MainPage;
