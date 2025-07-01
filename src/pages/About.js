import styles from './About.css';
export default function About(){
  return(
    <div className={styles.container}>
      <section className="about-section" style={{ maxWidth: '800px', margin: 'auto', padding: '2rem' }}>
      <h1>Cosmic Geometry</h1>
        <p>
        このサイトは、宇宙の根源に刻まれた「星々の記憶」を、<br />
        アートと数学の視点から紐解き、表現することを目指しています。
        </p>
        <p>
        かつて「StarsPioneeR」というサイトを運営していた頃の想いも大切にしつつ、<br />
        今はより洗練された形で、宇宙の幾何学的な美しさと調和を探求しています。
        </p>
        <p>
        ここは、宇宙の法則を感じ取り、地球の次元で新たな可能性を拓く<br />
        「星々の開拓者」たちの集う場所です。
        </p>
      </section>
    </div>
  );
}
