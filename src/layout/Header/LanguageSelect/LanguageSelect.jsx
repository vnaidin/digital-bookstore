import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import './LanguageSelect.css';

export default function LanguageSelect() {
  const { i18n } = useTranslation();
  return (
    <Form.Select
      aria-label="Lang-select"
      className="langSelect"
      size="sm"
      onChange={(event) => i18n.changeLanguage(event.target.value)}
      value={i18n.language === 'uk' ? 'en' : i18n.language}
    >
      <option value="en">EN</option>
      <option value="ua">UA</option>
    </Form.Select>
  );
}
