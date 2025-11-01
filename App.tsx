import React, { useState, useEffect } from 'react';
import { QuotationForm } from './components/QuotationForm.tsx';
import { SavedQuotesList } from './components/SavedQuotesList.tsx';
import { Header } from './components/Header.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import type { Quotation, CompanyDetails } from './types.ts';

type View = 'list' | 'form';

const defaultCompanyDetails: CompanyDetails = {
  name: 'HINDUSTAN TYRES',
  address: '123 Tyre Avenue, Auto City, 54321',
  phone: '+91 98765 43210',
  email: 'sales@hindustantyres.com',
  bankName: 'State Bank of India',
  accountHolder: 'HINDUSTAN TYRES',
  accountNumber: '12345678901',
  ifscCode: 'SBIN0001234',
  upiId: 'hindustantyres@upi',
  upiQrCode: '',
  defaultNotes: '1. All prices are inclusive of taxes.\n2. Warranty as per manufacturer terms.\n3. This quotation is valid for 7 days.',
  defaultTaxRate: 18,
};

const App: React.FC = () => {
  const [view, setView] = useState<View>('list');
  const [quotes, setQuotes] = useState<Quotation[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quotation | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>(defaultCompanyDetails);

  useEffect(() => {
    try {
      const savedQuotes = localStorage.getItem('tyreQuotes');
      if (savedQuotes) {
        setQuotes(JSON.parse(savedQuotes));
      }
      const savedDetails = localStorage.getItem('companyDetails');
      if (savedDetails) {
        // Merge saved details with defaults to ensure new fields are present
        const parsedDetails = JSON.parse(savedDetails);
        setCompanyDetails({ ...defaultCompanyDetails, ...parsedDetails });
      } else {
        setCompanyDetails(defaultCompanyDetails);
      }
    } catch (error) {
      console.error("Failed to load or parse data from localStorage", error);
      setQuotes([]);
      setCompanyDetails(defaultCompanyDetails);
    }
  }, []);

  const saveQuotesToLocalStorage = (updatedQuotes: Quotation[]) => {
    try {
      localStorage.setItem('tyreQuotes', JSON.stringify(updatedQuotes));
      setQuotes(updatedQuotes);
    } catch (error) {
      console.error("Failed to save quotes to localStorage", error);
    }
  };
  
  const handleSaveSettings = (details: CompanyDetails) => {
    try {
      localStorage.setItem('companyDetails', JSON.stringify(details));
      setCompanyDetails(details);
      setIsSettingsOpen(false);
    } catch (error) {
      console.error("Failed to save company details to localStorage", error);
    }
  };

  const handleSaveQuote = (quote: Quotation) => {
    const existingIndex = quotes.findIndex(q => q.id === quote.id);
    let updatedQuotes;
    if (existingIndex > -1) {
      updatedQuotes = [...quotes];
      updatedQuotes[existingIndex] = quote;
    } else {
      updatedQuotes = [...quotes, quote];
    }
    saveQuotesToLocalStorage(updatedQuotes);
    setView('list');
    setSelectedQuote(null);
  };

  const handleCreateNew = () => {
    setSelectedQuote(null);
    setView('form');
  };

  const handleEditQuote = (id: string) => {
    const quoteToEdit = quotes.find(q => q.id === id);
    if (quoteToEdit) {
      setSelectedQuote(quoteToEdit);
      setView('form');
    }
  };

  const handleDeleteQuote = (id: string) => {
    if (window.confirm('Are you sure you want to delete this quotation?')) {
      const updatedQuotes = quotes.filter(q => q.id !== id);
      saveQuotesToLocalStorage(updatedQuotes);
    }
  };

  const handleViewList = () => {
      setSelectedQuote(null);
      setView('list');
  }

  return (
    <>
      <div className="bg-slate-50 min-h-screen text-slate-800">
        <Header 
          currentView={view}
          onCreateNew={handleCreateNew} 
          onViewList={handleViewList} 
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
        <main className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
          {view === 'list' && (
            <SavedQuotesList
              quotes={quotes}
              onEdit={handleEditQuote}
              onDelete={handleDeleteQuote}
              onCreateNew={handleCreateNew}
            />
          )}
          {view === 'form' && (
            <QuotationForm
              initialData={selectedQuote}
              onSave={handleSaveQuote}
              onCancel={() => setView('list')}
              companyDetails={companyDetails}
              quotes={quotes}
            />
          )}
        </main>
      </div>
      {isSettingsOpen && (
        <SettingsModal 
          details={companyDetails}
          onSave={handleSaveSettings}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </>
  );
};

export default App;