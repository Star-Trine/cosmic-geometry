//pages/Sitemap.js
import './Sitemap.css';
function Sitemap(){
  return(
    <div className="sitemap">
      <h1>サイトマップ</h1>
        <ul>
          <li><a href="/">ホーム</a></li>
          <li><a href="/about">このサイトについて</a></li>
          <li><a href="/works">作品</a></li>
          <li><a href="/concepts">コンセプト</a></li>
          <li><a href="/tech-notes">技術ノート</a></li>
          <li><a href="/contact">お問い合わせ</a></li>
          <li><a href="/site-architecture">サイト設計</a></li>
          <li><a href="/privacy-policy">プライバシーポリシー</a></li>
        </ul>
      </div>
  );
}

export default Sitemap;
