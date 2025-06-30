//pages/Sitemap.js
import './Sitemap.css';
function Sitemap(){
  return(
    <div className="sitemap">
      <h1>サイトマップ</h1>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">このサイトについて</a></li>
          <li><a href="/works">作品</a></li>
          <li><a href="/blog">ブログ</a></li>
          <li><a href="/contact">お問い合わせ</a></li>
        </ul>
      </div>
  );
}

export default Sitemap;
