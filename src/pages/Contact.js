import './Contact.css'; // ← CSSファイルをインポート

export default function Contact() {
  return (
    <div className="contact">
      <h1>連絡先</h1>
      <ul className="contact-list">
        <li>
          <a href="https://github.com/Star-Trine" target="_blank" rel="noopener noreferrer">
            GitHub: Star-Trine
          </a>
        </li>
        {/* 必要があれば他の連絡先も追加可能 */}
      </ul>
    </div>
  );
}
