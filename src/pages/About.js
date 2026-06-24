import styles from './About.css';
export default function About(){
  return(
    <div className={styles.container}>
      <section className="about-section" style={{ maxWidth: '800px', margin: 'auto', padding: '2rem' }}>
      <h1>Cosmic Geometry</h1>
        <p>
      このサイトは、Reactを用いたフロントエンドの個人プロジェクトです。<br />
      星々の幾何学をテーマに、デジタルアート（色彩表現）と数学的構造の視点から表現を行っています。
        </p>
      </section>
    </div>
  );
}
