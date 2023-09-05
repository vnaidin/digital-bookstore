/* eslint-disable react/jsx-no-constructed-context-values */
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { LanguageSelect } from './LanguageSelect';

const mockedLngChangeHandler = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str) => str,
    i18n: {
      changeLanguage: mockedLngChangeHandler,
    },
  }),
}));

describe('LanguageSelect component', () => {
  it('renders LanguageSelect and default lng EN', () => {
    render(<LanguageSelect />);
    const langSelect = screen.getByRole('combobox', { name: /Lang-select/i });
    expect(langSelect).toBeInTheDocument();
    expect(langSelect).toHaveDisplayValue('EN');
  });

  it('has 4 languages', () => {
    render(<LanguageSelect />);
    const langSelect = screen.getAllByRole('option');
    expect(langSelect).toHaveLength(4);
  });

  it('changing the language', () => {
    render(<LanguageSelect />);
    const langSelect = screen.getByRole('combobox', { name: /Lang-select/i });
    fireEvent.change(langSelect, { target: { value: 'ua' } });
    expect(langSelect).toHaveDisplayValue('UA');
    expect(mockedLngChangeHandler).toBeCalled();
  });
});
