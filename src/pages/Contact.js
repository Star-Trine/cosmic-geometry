import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';

const categories = ['採用・仕事', '作品について', '技術について', 'その他'];

const createInitialFormData = () => ({
  name: '',
  email: '',
  category: '',
  message: '',
  companyWebsite: '',
});

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm(formData) {
  const nextErrors = {};
  const name = formData.name.trim();
  const email = formData.email.trim();
  const message = formData.message.trim();

  if (name.length < 1 || name.length > 100) {
    nextErrors.name = 'Nameは1〜100文字で入力してください。';
  }

  if (!emailPattern.test(email) || email.length > 254) {
    nextErrors.email = '有効なEmailを254文字以内で入力してください。';
  }

  if (!categories.includes(formData.category)) {
    nextErrors.category = 'Categoryを選択してください。';
  }

  if (message.length < 10 || message.length > 5000) {
    nextErrors.message = 'Messageは10〜5000文字で入力してください。';
  }

  return nextErrors;
}

export default function Contact() {
  const [formData, setFormData] = useState(createInitialFormData);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));

    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: undefined }));
    }

    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateForm(formData);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitStatus('error');
      return;
    }

    setSubmitStatus('submitting');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, formStartedAt }),
      });

      if (!response.ok) {
        throw new Error('Contact request failed');
      }

      setFormData(createInitialFormData());
      setErrors({});
      setSubmitStatus('success');
      setFormStartedAt(Date.now());
    } catch {
      setSubmitStatus('error');
    }
  };

  const fieldProps = (name) => ({
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  });

  return (
    <main className="contact">
      <header className="contact-header">
        <p className="contact-eyebrow">Connect with Cosmic Geometry</p>
        <h1>Contact（お問い合わせ）</h1>
        <p>
          採用・仕事・作品・技術に関するお問い合わせを受け付けています。
        </p>
      </header>

      <section className="contact-social" aria-labelledby="contact-social-title">
        <h2 id="contact-social-title">Social</h2>
        <ul className="contact-list">
          <li>
            <a href="https://github.com/Star-Trine" target="_blank" rel="noopener noreferrer">
              GitHub: Star-Trine
            </a>
          </li>
        </ul>
      </section>

      <section className="contact-form-section" aria-labelledby="contact-form-title">
        <div className="contact-form-heading">
          <p className="contact-section-label">Direct Message</p>
          <h2 id="contact-form-title">Contact Form</h2>
          <p>
            ご入力いただいた情報は、お問い合わせへの回答・対応のために利用します。
            詳細は<Link to="/privacy-policy">プライバシーポリシー</Link>をご確認ください。
          </p>
          <p className="contact-spam-note">
            自動送信、大量送信、スパム、内容と無関係な機械的な営業送信はご遠慮ください。
          </p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <div className="contact-field">
            <label htmlFor="contact-name">Name</label>
            <input
              id="contact-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              maxLength="100"
              required
              {...fieldProps('name')}
            />
            {errors.name && <p className="contact-error" id="name-error">{errors.name}</p>}
          </div>

          <div className="contact-field">
            <label htmlFor="contact-email">Email</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              maxLength="254"
              required
              {...fieldProps('email')}
            />
            {errors.email && <p className="contact-error" id="email-error">{errors.email}</p>}
          </div>

          <div className="contact-field">
            <label htmlFor="contact-category">Category</label>
            <select
              id="contact-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              {...fieldProps('category')}
            >
              <option value="">選択してください</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {errors.category && (
              <p className="contact-error" id="category-error">{errors.category}</p>
            )}
          </div>

          <div className="contact-field">
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="8"
              maxLength="5000"
              required
              {...fieldProps('message')}
            />
            <span className="contact-character-count" aria-hidden="true">
              {formData.message.length} / 5000
            </span>
            {errors.message && (
              <p className="contact-error" id="message-error">{errors.message}</p>
            )}
          </div>

          <div className="contact-honeypot" aria-hidden="true">
            <label htmlFor="company-website">Website</label>
            <input
              id="company-website"
              name="companyWebsite"
              type="text"
              value={formData.companyWebsite}
              onChange={handleChange}
              tabIndex="-1"
              autoComplete="off"
            />
          </div>

          <button
            className="contact-submit"
            type="submit"
            disabled={submitStatus === 'submitting'}
          >
            {submitStatus === 'submitting' ? 'Sending…' : 'Submit'}
          </button>

          <div className="contact-submit-status" aria-live="polite" role="status">
            {submitStatus === 'success' && (
              <p className="is-success">お問い合わせを受け付けました。</p>
            )}
            {submitStatus === 'error' && Object.keys(errors).length === 0 && (
              <p className="is-error">
                送信できませんでした。時間をおいて、もう一度お試しください。
              </p>
            )}
            {submitStatus === 'error' && Object.keys(errors).length > 0 && (
              <p className="is-error">入力内容をご確認ください。</p>
            )}
          </div>
        </form>
      </section>
    </main>
  );
}
