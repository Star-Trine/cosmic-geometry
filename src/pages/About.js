import styles from './About.css';
export default function About(){
  return(
    <div className={styles.container}>
      <section className="about-section" style={{ maxWidth: '800px', margin: 'auto', padding: '2rem' }}>
      <h1>このサイトについて</h1>
        <br>
        </br>
        <p>
          Cosmic Geometryは、幾何学、波動、宇宙などをテーマに、
          インタラクティブな表現を探究する個人制作プロジェクトです。<br /><br />

          フロントエンド表現にはReact、バックエンド構築にはNode.jsを用い、
          それらを記述するプログラミング言語としてJavaScript・TypeScriptを使用しています。
          プロジェクト全体を通して、一貫してJavaScript系列の技術を選定しています。<br /><br />

          デジタルアートとしての色彩や音響表現を、数学的なアルゴリズムや構造と組み合わせ、
          見えにくい概念を視覚・聴覚的に体験できる作品づくりを目指しています。<br /><br />

          将来的には、Web上にひとつの博物館のような空間をつくることを目標としています。<br /><br />

          この個人プロジェクトの出発点は、
          過去にWordPressで制作していた「StarsPioneeR」というWebサイトにあります。
      </p>
        
      </section>
    </div>
  );
}
