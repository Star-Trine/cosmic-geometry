import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const categories = ['採用・仕事', '作品について', '技術について', 'その他'] as const;
const categorySet = new Set<string>(categories);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const headerInjectionPattern = /[\r\n]/;
const maxBodyBytes = 32 * 1024;
const minimumSubmitTimeMs = 1500;
const rateLimitWindowMs = 10 * 60 * 1000;
const rateLimitMaximum = 5;

type ContactRequestBody = {
  name?: unknown;
  email?: unknown;
  category?: unknown;
  message?: unknown;
  companyWebsite?: unknown;
  formStartedAt?: unknown;
};

type RateLimitRecord = {
  count: number;
  windowStartedAt: number;
};

const rateLimitStore = new Map<string, RateLimitRecord>();

function getClientIp(request: VercelRequest) {
  const forwardedFor = request.headers['x-forwarded-for'];
  const forwardedValue = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;

  return (
    forwardedValue?.split(',')[0]?.trim() ||
    request.socket.remoteAddress ||
    'unknown'
  );
}

function isRateLimited(ipAddress: string, now: number) {
  if (rateLimitStore.size > 1000) {
    for (const [storedIp, record] of rateLimitStore) {
      if (now - record.windowStartedAt >= rateLimitWindowMs) {
        rateLimitStore.delete(storedIp);
      }
    }
  }

  const current = rateLimitStore.get(ipAddress);

  if (!current || now - current.windowStartedAt >= rateLimitWindowMs) {
    rateLimitStore.set(ipAddress, {
      count: 1,
      windowStartedAt: now,
    });

    return false;
  }

  current.count += 1;

  return current.count > rateLimitMaximum;
}

function getBody(request: VercelRequest): ContactRequestBody | null {
  if (!request.body || Array.isArray(request.body)) {
    return null;
  }

  if (typeof request.body === 'string') {
    try {
      return JSON.parse(request.body) as ContactRequestBody;
    } catch {
      return null;
    }
  }

  if (typeof request.body === 'object') {
    return request.body as ContactRequestBody;
  }

  return null;
}

function getTrimmedString(value: unknown) {
  return typeof value === 'string' ? value.trim() : null;
}

function validateBody(body: ContactRequestBody) {
  const name = getTrimmedString(body.name);
  const email = getTrimmedString(body.email);
  const category = getTrimmedString(body.category);
  const message = getTrimmedString(body.message);
  const honeypot = getTrimmedString(body.companyWebsite);

  const formStartedAt =
    typeof body.formStartedAt === 'number'
      ? body.formStartedAt
      : NaN;

  const valid = Boolean(
    name &&
      name.length <= 100 &&
      !headerInjectionPattern.test(name) &&
      email &&
      email.length <= 254 &&
      emailPattern.test(email) &&
      !headerInjectionPattern.test(email) &&
      category &&
      categorySet.has(category) &&
      !headerInjectionPattern.test(category) &&
      message &&
      message.length >= 10 &&
      message.length <= 5000 &&
      honeypot === '' &&
      Number.isFinite(formStartedAt) &&
      Date.now() - formStartedAt >= minimumSubmitTimeMs
  );

  return valid && name && email && category && message
    ? {
        name,
        email,
        category,
        message,
      }
    : null;
}

function sendGenericError(
  response: VercelResponse,
  statusCode = 400
) {
  return response.status(statusCode).json({
    ok: false,
    message: 'お問い合わせを送信できませんでした。',
  });
}

export default async function contactHandler(
  request: VercelRequest,
  response: VercelResponse
) {
  response.setHeader('Allow', 'POST');

  if (request.method !== 'POST') {
    return sendGenericError(response, 405);
  }

  const contentType = request.headers['content-type'] || '';
  const contentLength = Number(
    request.headers['content-length'] || 0
  );

  if (!contentType.includes('application/json')) {
    return sendGenericError(response, 415);
  }

  if (
    !Number.isFinite(contentLength) ||
    contentLength > maxBodyBytes
  ) {
    return sendGenericError(response, 413);
  }

  const body = getBody(request);

  if (
    !body ||
    Buffer.byteLength(JSON.stringify(body), 'utf8') >
      maxBodyBytes
  ) {
    return sendGenericError(response, 413);
  }

  const now = Date.now();
  const ipAddress = getClientIp(request);

  if (isRateLimited(ipAddress, now)) {
    return sendGenericError(response, 429);
  }

  const contact = validateBody(body);

  if (!contact) {
    return sendGenericError(response);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const contactTo = process.env.CONTACT_TO;
  const contactFrom = process.env.CONTACT_FROM;

  console.log('Contact environment check:', {
    hasApiKey: Boolean(apiKey),
    hasContactTo: Boolean(contactTo),
    hasContactFrom: Boolean(contactFrom),
  });

  if (!apiKey || !contactTo || !contactFrom) {
    console.error(
      'Contact API environment variables are missing.'
    );

    return sendGenericError(response, 500);
  }

  try {
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: contactFrom,
      to: [contactTo],
      replyTo: contact.email,
      subject: `[Cosmic Geometry] ${contact.category}`,
      text: [
        'Cosmic Geometry Contact Form',
        '',
        `Name: ${contact.name}`,
        `Email: ${contact.email}`,
        `Category: ${contact.category}`,
        '',
        'Message:',
        contact.message,
      ].join('\n'),
    });

    if (error) {
      console.error('Resend error:', error);

      return sendGenericError(response, 502);
    }

    return response.status(200).json({
      ok: true,
      message: 'お問い合わせを受け付けました。',
    });
  } catch (error) {
    console.error('Contact API error:', error);

    return sendGenericError(response, 500);
  }
}